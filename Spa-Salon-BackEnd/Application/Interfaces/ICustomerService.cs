using Spa_Salon_BackEnd.Application.DTOs.Common;
using Spa_Salon_BackEnd.Application.DTOs.Customer;

namespace Spa_Salon_BackEnd.Application.Interfaces;

public interface ICustomerService
{
    Task<PagedResult<CustomerDto>> GetAllAsync(PaginationParams paginationParams);
    Task<CustomerDetailDto?> GetByIdAsync(Guid id);
    Task<CustomerDto?> GetByUserIdAsync(Guid userId);
    Task<CustomerDto> CreateAsync(CreateCustomerDto createDto);
    Task<CustomerDto?> UpdateAsync(Guid id, UpdateCustomerDto updateDto);
    Task<bool> DeleteAsync(Guid id);
}
