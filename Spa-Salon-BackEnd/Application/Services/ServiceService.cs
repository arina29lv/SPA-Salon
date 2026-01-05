using AutoMapper;
using Spa_Salon_BackEnd.Application.DTOs.Common;
using Spa_Salon_BackEnd.Application.DTOs.Service;
using Spa_Salon_BackEnd.Application.Interfaces;
using Spa_Salon_BackEnd.Domain.Entities;
using Spa_Salon_BackEnd.Domain.Interfaces;

namespace Spa_Salon_BackEnd.Application.Services;

public class ServiceService : IServiceService
{
    private readonly IServiceRepository _serviceRepository;
    private readonly IMapper _mapper;

    public ServiceService(IServiceRepository serviceRepository, IMapper mapper)
    {
        _serviceRepository = serviceRepository;
        _mapper = mapper;
    }

    public async Task<PagedResult<ServiceDto>> GetAllAsync(PaginationParams paginationParams)
    {
        var (services, totalCount) = await _serviceRepository.GetPagedWithDetailsAsync(
            paginationParams.Page,
            paginationParams.PageSize
        );

        return new PagedResult<ServiceDto>
        {
            Items = _mapper.Map<IEnumerable<ServiceDto>>(services),
            TotalCount = totalCount,
            Page = paginationParams.Page,
            PageSize = paginationParams.PageSize
        };
    }

    public async Task<IEnumerable<ServiceDto>> GetActiveServicesAsync()
    {
        var services = await _serviceRepository.GetActiveServicesAsync();
        return _mapper.Map<IEnumerable<ServiceDto>>(services);
    }

    public async Task<ServiceDetailDto?> GetByIdAsync(Guid id)
    {
        var service = await _serviceRepository.GetByIdWithDetailsAsync(id);
        if (service == null) return null;

        return _mapper.Map<ServiceDetailDto>(service);
    }

    public async Task<ServiceDto> CreateAsync(CreateServiceDto createDto)
    {
        var service = new Service
        {
            Id = Guid.NewGuid(),
            Name = createDto.Name,
            Description = createDto.Description ?? string.Empty,
            DurationMinutes = createDto.DurationMinutes,
            Price = createDto.Price,
            IsActive = createDto.IsActive,
            EmployeeId = createDto.EmployeeId
        };

        await _serviceRepository.AddAsync(service);

        var savedService = await _serviceRepository.GetByIdWithDetailsAsync(service.Id);

        return _mapper.Map<ServiceDto>(savedService);
    }

    public async Task<ServiceDto?> UpdateAsync(Guid id, UpdateServiceDto updateDto)
    {
        var service = await _serviceRepository.GetByIdAsync(id);
        if (service == null) return null;

        if (updateDto.Name != null) service.Name = updateDto.Name;
        if (updateDto.Description != null) service.Description = updateDto.Description;
        if (updateDto.DurationMinutes.HasValue) service.DurationMinutes = updateDto.DurationMinutes.Value;
        if (updateDto.Price.HasValue) service.Price = updateDto.Price.Value;
        if (updateDto.IsActive.HasValue) service.IsActive = updateDto.IsActive.Value;
        if (updateDto.EmployeeId.HasValue) service.EmployeeId = updateDto.EmployeeId.Value;

        await _serviceRepository.UpdateAsync(service);

        var savedService = await _serviceRepository.GetByIdWithDetailsAsync(service.Id);

        return _mapper.Map<ServiceDto>(savedService);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var service = await _serviceRepository.GetByIdAsync(id);
        if (service == null) return false;

        await _serviceRepository.DeleteAsync(service);
        return true;
    }
}
