namespace Spa_Salon_BackEnd.Domain.Entities;

public class AppointmentService
{
    public Guid Id { get; set; }
    public Guid AppointmentId { get; set; }
    public Guid ServiceId { get; set; }
    public Guid EmployeeId { get; set; }
    public decimal Price { get; set; }

    public Appointment Appointment { get; set; } = null!;
    public Service Service { get; set; } = null!;
    public Employee Employee { get; set; } = null!;
}
