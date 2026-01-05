using Microsoft.EntityFrameworkCore;
using Spa_Salon_BackEnd.Domain.Entities;
using Spa_Salon_BackEnd.Domain.Interfaces;
using Spa_Salon_BackEnd.Infrastructure.Data;

namespace Spa_Salon_BackEnd.Infrastructure.Repositories;

public class AppointmentServiceRepository : BaseRepository<AppointmentService>, IAppointmentServiceRepository
{
    public AppointmentServiceRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<AppointmentService?> GetByIdWithDetailsAsync(Guid id)
    {
        return await _dbSet
            .Include(aps => aps.Appointment)
                .ThenInclude(a => a.Customer)
            .Include(aps => aps.Service)
            .Include(aps => aps.Employee)
            .FirstOrDefaultAsync(aps => aps.Id == id);
    }

    public async Task<IEnumerable<AppointmentService>> GetByAppointmentAsync(Guid appointmentId)
    {
        return await _dbSet
            .Include(aps => aps.Service)
            .Include(aps => aps.Employee)
            .Where(aps => aps.AppointmentId == appointmentId)
            .ToListAsync();
    }

    public async Task<IEnumerable<AppointmentService>> GetByEmployeeAsync(Guid employeeId)
    {
        return await _dbSet
            .Include(aps => aps.Appointment)
                .ThenInclude(a => a.Customer)
            .Include(aps => aps.Service)
            .Where(aps => aps.EmployeeId == employeeId)
            .OrderByDescending(aps => aps.Appointment.AppointmentDateTime)
            .ToListAsync();
    }

    public async Task<IEnumerable<AppointmentService>> GetByServiceAsync(Guid serviceId)
    {
        return await _dbSet
            .Include(aps => aps.Appointment)
                .ThenInclude(a => a.Customer)
            .Include(aps => aps.Employee)
            .Where(aps => aps.ServiceId == serviceId)
            .ToListAsync();
    }

    public override async Task<AppointmentService?> GetByIdAsync(Guid id)
    {
        return await _dbSet
            .Include(aps => aps.Service)
            .Include(aps => aps.Employee)
            .FirstOrDefaultAsync(aps => aps.Id == id);
    }
}
