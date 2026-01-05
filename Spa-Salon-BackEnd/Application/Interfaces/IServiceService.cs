using Spa_Salon_BackEnd.Application.DTOs.Common;
using Spa_Salon_BackEnd.Application.DTOs.Service;

namespace Spa_Salon_BackEnd.Application.Interfaces;

public interface IServiceService
{
    Task<PagedResult<ServiceDto>> GetAllAsync(PaginationParams paginationParams);
    Task<IEnumerable<ServiceDto>> GetActiveServicesAsync();
    Task<ServiceDetailDto?> GetByIdAsync(Guid id);
    Task<ServiceDto> CreateAsync(CreateServiceDto createDto);
    Task<ServiceDto?> UpdateAsync(Guid id, UpdateServiceDto updateDto);
    Task<bool> DeleteAsync(Guid id);
}
