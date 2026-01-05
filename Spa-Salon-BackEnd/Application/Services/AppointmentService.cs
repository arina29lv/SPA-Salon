using AutoMapper;
using Spa_Salon_BackEnd.Application.DTOs.Appointment;
using Spa_Salon_BackEnd.Application.DTOs.Common;
using Spa_Salon_BackEnd.Application.Interfaces;
using Spa_Salon_BackEnd.Domain.Entities;
using Spa_Salon_BackEnd.Domain.Entities.Enums;
using Spa_Salon_BackEnd.Domain.Interfaces;

namespace Spa_Salon_BackEnd.Application.Services;

public class AppointmentService : IAppointmentService
{
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly IServiceRepository _serviceRepository;
    private readonly IMapper _mapper;

    public AppointmentService(
        IAppointmentRepository appointmentRepository,
        IServiceRepository serviceRepository,
        IMapper mapper)
    {
        _appointmentRepository = appointmentRepository;
        _serviceRepository = serviceRepository;
        _mapper = mapper;
    }

    public async Task<PagedResult<AppointmentDto>> GetAllAsync(PaginationParams paginationParams, Guid? customerId = null, Guid? employeeId = null)
    {
        var (appointments, totalCount) = await _appointmentRepository.GetPagedWithDetailsAsync(
            paginationParams.Page,
            paginationParams.PageSize,
            customerId,
            employeeId
        );

        return new PagedResult<AppointmentDto>
        {
            Items = _mapper.Map<IEnumerable<AppointmentDto>>(appointments),
            TotalCount = totalCount,
            Page = paginationParams.Page,
            PageSize = paginationParams.PageSize
        };
    }

    public async Task<AppointmentDetailDto?> GetByIdAsync(Guid id)
    {
        var appointment = await _appointmentRepository.GetByIdWithDetailsAsync(id);
        if (appointment == null) return null;

        return _mapper.Map<AppointmentDetailDto>(appointment);
    }

    public async Task<bool> IsEmployeeAvailableAsync(Guid employeeId, DateTime dateTime, int durationMinutes, Guid? excludeAppointmentId = null)
    {
        var appointmentEnd = dateTime.AddMinutes(durationMinutes);

        var startOfDay = dateTime.Date;
        var endOfDay = startOfDay.AddDays(1);

        var existingAppointments = await _appointmentRepository.GetByEmployeeAndDateRangeAsync(employeeId, startOfDay, endOfDay);

        var relevantAppointments = existingAppointments
            .Where(a => a.Status == AppointmentStatus.Scheduled || a.Status == AppointmentStatus.InProgress)
            .Where(a => excludeAppointmentId == null || a.Id != excludeAppointmentId);

        foreach (var appointment in relevantAppointments)
        {
            var existingStart = appointment.AppointmentDateTime;
            var existingDuration = appointment.AppointmentServices
                .Where(s => s.EmployeeId == employeeId)
                .Sum(s => s.Service.DurationMinutes);
            var existingEnd = existingStart.AddMinutes(existingDuration);

            if (dateTime < existingEnd && appointmentEnd > existingStart)
                return false;
        }

        return true;
    }

    public async Task<AppointmentDto> CreateAsync(CreateAppointmentDto createDto, bool isManagerOrAdmin = false)
    {
        var appointmentServices = new List<Domain.Entities.AppointmentService>();
        decimal totalPrice = 0;
        int totalDuration = 0;

        foreach (var serviceDto in createDto.Services)
        {
            var service = await _serviceRepository.GetByIdAsync(serviceDto.ServiceId);
            if (service == null)
            {
                throw new KeyNotFoundException($"Service with ID {serviceDto.ServiceId} not found");
            }

            var isAvailable = await IsEmployeeAvailableAsync(
                serviceDto.EmployeeId,
                createDto.AppointmentDateTime.AddMinutes(totalDuration),
                service.DurationMinutes
            );

            if (!isAvailable)
            {
                throw new InvalidOperationException($"Employee is not available at the requested time for service '{service.Name}'");
            }

            var price = serviceDto.Price ?? service.Price;
            totalPrice += price;
            totalDuration += service.DurationMinutes;

            appointmentServices.Add(new Domain.Entities.AppointmentService
            {
                Id = Guid.NewGuid(),
                ServiceId = serviceDto.ServiceId,
                EmployeeId = serviceDto.EmployeeId,
                Price = price
            });
        }

        var initialStatus = isManagerOrAdmin ? AppointmentStatus.Scheduled : AppointmentStatus.Requested;

        var appointment = new Appointment
        {
            Id = Guid.NewGuid(),
            CustomerId = createDto.CustomerId,
            AppointmentDateTime = createDto.AppointmentDateTime,
            Status = initialStatus,
            Notes = createDto.Notes,
            TotalPrice = totalPrice,
            CreatedAt = DateTime.UtcNow,
            AppointmentServices = appointmentServices
        };

        foreach (var aps in appointmentServices)
        {
            aps.AppointmentId = appointment.Id;
        }

        await _appointmentRepository.AddAsync(appointment);

        var createdAppointment = await _appointmentRepository.GetByIdWithDetailsAsync(appointment.Id);

        return _mapper.Map<AppointmentDto>(createdAppointment);
    }

    public async Task<(bool Success, string? ErrorMessage)> ApproveAsync(Guid id)
    {
        var appointment = await _appointmentRepository.GetByIdWithDetailsAsync(id);
        if (appointment == null)
            return (false, "Appointment not found");

        if (appointment.Status != AppointmentStatus.Requested)
            return (false, "Only requested appointments can be approved");

        int cumulativeDuration = 0;
        foreach (var service in appointment.AppointmentServices)
        {
            var isAvailable = await IsEmployeeAvailableAsync(
                service.EmployeeId,
                appointment.AppointmentDateTime.AddMinutes(cumulativeDuration),
                service.Service.DurationMinutes,
                appointment.Id
            );

            if (!isAvailable)
            {
                return (false, $"Employee '{service.Employee.FirstName} {service.Employee.LastName}' is not available at the requested time");
            }

            cumulativeDuration += service.Service.DurationMinutes;
        }

        appointment.Status = AppointmentStatus.Scheduled;
        await _appointmentRepository.UpdateAsync(appointment);
        return (true, null);
    }

    public async Task<bool> RejectAsync(Guid id)
    {
        var appointment = await _appointmentRepository.GetByIdAsync(id);
        if (appointment == null)
            return false;

        if (appointment.Status != AppointmentStatus.Requested)
            return false;

        appointment.Status = AppointmentStatus.Cancelled;
        await _appointmentRepository.UpdateAsync(appointment);
        return true;
    }

    public async Task<AppointmentDto?> UpdateAsync(Guid id, UpdateAppointmentDto updateDto)
    {
        var appointment = await _appointmentRepository.GetByIdAsync(id);
        if (appointment == null) return null;

        if (updateDto.AppointmentDateTime.HasValue) appointment.AppointmentDateTime = updateDto.AppointmentDateTime.Value;
        if (updateDto.Status.HasValue) appointment.Status = updateDto.Status.Value;
        if (updateDto.Notes != null) appointment.Notes = updateDto.Notes;

        await _appointmentRepository.UpdateAsync(appointment);

        var updatedAppointment = await _appointmentRepository.GetByIdWithDetailsAsync(appointment.Id);

        return _mapper.Map<AppointmentDto>(updatedAppointment);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var appointment = await _appointmentRepository.GetByIdAsync(id);
        if (appointment == null) return false;

        await _appointmentRepository.DeleteAsync(appointment);
        return true;
    }

    public async Task<IEnumerable<AppointmentDto>> GetByCustomerAsync(Guid customerId)
    {
        var appointments = await _appointmentRepository.GetByCustomerAsync(customerId);
        return _mapper.Map<IEnumerable<AppointmentDto>>(appointments);
    }
}
