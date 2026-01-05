using Spa_Salon_BackEnd.Domain.Entities.Enums;

namespace Spa_Salon_BackEnd.Domain.Entities;

public class Appointment
{
    public Guid Id { get; set; }
    public Guid CustomerId { get; set; }
    public DateTime AppointmentDateTime { get; set; }
    public AppointmentStatus Status { get; set; } = AppointmentStatus.Scheduled;
    public string? Notes { get; set; }
    public decimal TotalPrice { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Customer Customer { get; set; } = null!;
    public ICollection<AppointmentService> AppointmentServices { get; set; } = new List<AppointmentService>();
}
