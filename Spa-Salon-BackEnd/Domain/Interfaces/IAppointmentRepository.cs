using Spa_Salon_BackEnd.Domain.Entities;

namespace Spa_Salon_BackEnd.Domain.Interfaces;

public interface IAppointmentRepository : IRepository<Appointment>
{
    Task<Appointment?> GetByIdWithDetailsAsync(Guid id);
    Task<IEnumerable<Appointment>> GetByCustomerAsync(Guid customerId);
    Task<IEnumerable<Appointment>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
    Task<(IEnumerable<Appointment> Items, int TotalCount)> GetPagedWithDetailsAsync(int page, int pageSize, Guid? customerId = null, Guid? employeeId = null);
    Task<IEnumerable<Appointment>> GetByEmployeeAndDateRangeAsync(Guid employeeId, DateTime startDate, DateTime endDate);
}
