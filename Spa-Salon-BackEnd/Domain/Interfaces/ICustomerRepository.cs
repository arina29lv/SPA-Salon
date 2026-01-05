using Spa_Salon_BackEnd.Domain.Entities;

namespace Spa_Salon_BackEnd.Domain.Interfaces;

public interface ICustomerRepository : IRepository<Customer>
{
    Task<Customer?> GetByIdWithDetailsAsync(Guid id);
    Task<Customer?> GetByUserIdAsync(Guid userId);
    Task<Customer?> GetByEmailAsync(string email);
    Task<(IEnumerable<Customer> Items, int TotalCount)> GetPagedWithDetailsAsync(int page, int pageSize);
}
