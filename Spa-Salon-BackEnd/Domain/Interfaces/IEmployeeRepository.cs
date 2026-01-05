using Spa_Salon_BackEnd.Domain.Entities;

namespace Spa_Salon_BackEnd.Domain.Interfaces;

public interface IEmployeeRepository : IRepository<Employee>
{
    Task<Employee?> GetByIdWithDetailsAsync(Guid id);
    Task<Employee?> GetByUserIdAsync(Guid userId);
    Task<Employee?> GetByEmailAsync(string email);
    Task<(IEnumerable<Employee> Items, int TotalCount)> GetPagedWithDetailsAsync(int page, int pageSize);
}
