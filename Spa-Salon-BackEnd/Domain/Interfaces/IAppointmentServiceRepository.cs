using Spa_Salon_BackEnd.Domain.Entities;

namespace Spa_Salon_BackEnd.Domain.Interfaces;

public interface IAppointmentServiceRepository : IRepository<AppointmentService>
{
    Task<AppointmentService?> GetByIdWithDetailsAsync(Guid id);
    Task<IEnumerable<AppointmentService>> GetByAppointmentAsync(Guid appointmentId);
    Task<IEnumerable<AppointmentService>> GetByEmployeeAsync(Guid employeeId);
    Task<IEnumerable<AppointmentService>> GetByServiceAsync(Guid serviceId);
}
