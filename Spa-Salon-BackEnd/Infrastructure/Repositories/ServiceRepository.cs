using Microsoft.EntityFrameworkCore;
using Spa_Salon_BackEnd.Domain.Entities;
using Spa_Salon_BackEnd.Domain.Interfaces;
using Spa_Salon_BackEnd.Infrastructure.Data;

namespace Spa_Salon_BackEnd.Infrastructure.Repositories;

public class ServiceRepository : BaseRepository<Service>, IServiceRepository
{
    public ServiceRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<Service?> GetByIdWithDetailsAsync(Guid id)
    {
        return await _dbSet
            .Include(s => s.Employee)
            .Include(s => s.AppointmentServices)
                .ThenInclude(aps => aps.Employee)
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<IEnumerable<Service>> GetActiveServicesAsync()
    {
        return await _dbSet
            .Include(s => s.Employee)
            .Where(s => s.IsActive)
            .OrderBy(s => s.Name)
            .ToListAsync();
    }

    public async Task<(IEnumerable<Service> Items, int TotalCount)> GetPagedWithDetailsAsync(int page, int pageSize)
    {
        var query = _dbSet.Include(s => s.Employee).AsQueryable();

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderBy(s => s.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }
}
