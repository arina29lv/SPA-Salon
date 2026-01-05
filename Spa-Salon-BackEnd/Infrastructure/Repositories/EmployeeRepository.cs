using Microsoft.EntityFrameworkCore;
using Spa_Salon_BackEnd.Domain.Entities;
using Spa_Salon_BackEnd.Domain.Interfaces;
using Spa_Salon_BackEnd.Infrastructure.Data;

namespace Spa_Salon_BackEnd.Infrastructure.Repositories;

public class EmployeeRepository : BaseRepository<Employee>, IEmployeeRepository
{
    public EmployeeRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<Employee?> GetByIdWithDetailsAsync(Guid id)
    {
        return await _dbSet
            .Include(e => e.User)
            .Include(e => e.AppointmentServices)
                .ThenInclude(aps => aps.Service)
            .Include(e => e.AppointmentServices)
                .ThenInclude(aps => aps.Appointment)
                    .ThenInclude(a => a.Customer)
            .FirstOrDefaultAsync(e => e.Id == id);
    }

    public async Task<Employee?> GetByUserIdAsync(Guid userId)
    {
        return await _dbSet
            .Include(e => e.User)
            .FirstOrDefaultAsync(e => e.UserId == userId);
    }

    public async Task<Employee?> GetByEmailAsync(string email)
    {
        return await _dbSet
            .Include(e => e.User)
            .FirstOrDefaultAsync(e => e.Email == email);
    }

    public async Task<(IEnumerable<Employee> Items, int TotalCount)> GetPagedWithDetailsAsync(int page, int pageSize)
    {
        var query = _dbSet
            .Include(e => e.User)
            .AsQueryable();

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderBy(e => e.LastName)
            .ThenBy(e => e.FirstName)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public override async Task<Employee?> GetByIdAsync(Guid id)
    {
        return await _dbSet
            .Include(e => e.User)
            .FirstOrDefaultAsync(e => e.Id == id);
    }
}
