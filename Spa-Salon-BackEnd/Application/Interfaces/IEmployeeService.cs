using Spa_Salon_BackEnd.Application.DTOs.Common;
using Spa_Salon_BackEnd.Application.DTOs.Employee;

namespace Spa_Salon_BackEnd.Application.Interfaces;

public interface IEmployeeService
{
    Task<PagedResult<EmployeeDto>> GetAllAsync(PaginationParams paginationParams);
    Task<IEnumerable<EmployeeDto>> GetAllListAsync();
    Task<EmployeeDetailDto?> GetByIdAsync(Guid id);
    Task<EmployeeDto?> GetByUserIdAsync(Guid userId);
    Task<EmployeeDto> CreateAsync(CreateEmployeeDto createDto);
    Task<EmployeeDto?> UpdateAsync(Guid id, UpdateEmployeeDto updateDto);
    Task<bool> DeleteAsync(Guid id);
}
