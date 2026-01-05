using Spa_Salon_BackEnd.Application.DTOs.Appointment;
using Spa_Salon_BackEnd.Application.DTOs.Common;

namespace Spa_Salon_BackEnd.Application.Interfaces;

public interface IAppointmentService
{
    Task<PagedResult<AppointmentDto>> GetAllAsync(PaginationParams paginationParams, Guid? customerId = null, Guid? employeeId = null);
    Task<AppointmentDetailDto?> GetByIdAsync(Guid id);
    Task<AppointmentDto> CreateAsync(CreateAppointmentDto createDto, bool isManagerOrAdmin = false);
    Task<AppointmentDto?> UpdateAsync(Guid id, UpdateAppointmentDto updateDto);
    Task<bool> DeleteAsync(Guid id);
    Task<IEnumerable<AppointmentDto>> GetByCustomerAsync(Guid customerId);
    Task<(bool Success, string? ErrorMessage)> ApproveAsync(Guid id);
    Task<bool> RejectAsync(Guid id);
    Task<bool> IsEmployeeAvailableAsync(Guid employeeId, DateTime dateTime, int durationMinutes, Guid? excludeAppointmentId = null);
}
