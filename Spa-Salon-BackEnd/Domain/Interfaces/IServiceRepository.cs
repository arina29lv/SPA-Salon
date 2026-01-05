using Spa_Salon_BackEnd.Domain.Entities;

namespace Spa_Salon_BackEnd.Domain.Interfaces;

public interface IServiceRepository : IRepository<Service>
{
    Task<Service?> GetByIdWithDetailsAsync(Guid id);
    Task<IEnumerable<Service>> GetActiveServicesAsync();
    Task<(IEnumerable<Service> Items, int TotalCount)> GetPagedWithDetailsAsync(int page, int pageSize);
}
