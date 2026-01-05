using Microsoft.EntityFrameworkCore;
using Spa_Salon_BackEnd.Domain.Entities;
using Spa_Salon_BackEnd.Domain.Interfaces;
using Spa_Salon_BackEnd.Infrastructure.Data;

namespace Spa_Salon_BackEnd.Infrastructure.Repositories;

public class AppointmentRepository : BaseRepository<Appointment>, IAppointmentRepository
{
    public AppointmentRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<Appointment?> GetByIdWithDetailsAsync(Guid id)
    {
        return await _dbSet
            .Include(a => a.Customer)
            .Include(a => a.AppointmentServices)
                .ThenInclude(aps => aps.Service)
            .Include(a => a.AppointmentServices)
                .ThenInclude(aps => aps.Employee)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<IEnumerable<Appointment>> GetByCustomerAsync(Guid customerId)
    {
        return await _dbSet
            .Include(a => a.Customer)
            .Include(a => a.AppointmentServices)
                .ThenInclude(aps => aps.Service)
            .Include(a => a.AppointmentServices)
                .ThenInclude(aps => aps.Employee)
            .Where(a => a.CustomerId == customerId)
            .OrderByDescending(a => a.AppointmentDateTime)
            .ToListAsync();
    }

    public async Task<IEnumerable<Appointment>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        return await _dbSet
            .Include(a => a.Customer)
            .Include(a => a.AppointmentServices)
                .ThenInclude(aps => aps.Service)
            .Include(a => a.AppointmentServices)
                .ThenInclude(aps => aps.Employee)
            .Where(a => a.AppointmentDateTime >= startDate && a.AppointmentDateTime <= endDate)
            .OrderBy(a => a.AppointmentDateTime)
            .ToListAsync();
    }

    public async Task<(IEnumerable<Appointment> Items, int TotalCount)> GetPagedWithDetailsAsync(
        int page,
        int pageSize,
        Guid? customerId = null,
        Guid? employeeId = null)
    {
        var query = _dbSet
            .Include(a => a.Customer)
            .Include(a => a.AppointmentServices)
                .ThenInclude(aps => aps.Service)
            .Include(a => a.AppointmentServices)
                .ThenInclude(aps => aps.Employee)
            .AsQueryable();

        if (customerId.HasValue)
        {
            query = query.Where(a => a.CustomerId == customerId.Value);
        }

        if (employeeId.HasValue)
        {
            query = query.Where(a => a.AppointmentServices.Any(aps => aps.EmployeeId == employeeId.Value));
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(a => a.AppointmentDateTime)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public override async Task<Appointment?> GetByIdAsync(Guid id)
    {
        return await _dbSet
            .Include(a => a.Customer)
            .Include(a => a.AppointmentServices)
                .ThenInclude(aps => aps.Service)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<IEnumerable<Appointment>> GetByEmployeeAndDateRangeAsync(Guid employeeId, DateTime startDate, DateTime endDate)
    {
        return await _dbSet
            .Include(a => a.AppointmentServices)
                .ThenInclude(aps => aps.Service)
            .Where(a => a.AppointmentServices.Any(aps => aps.EmployeeId == employeeId))
            .Where(a => a.AppointmentDateTime >= startDate && a.AppointmentDateTime <= endDate)
            .ToListAsync();
    }
}
