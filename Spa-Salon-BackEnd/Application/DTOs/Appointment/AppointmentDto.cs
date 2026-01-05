using Spa_Salon_BackEnd.Domain.Entities.Enums;

namespace Spa_Salon_BackEnd.Application.DTOs.Appointment;

public class AppointmentDto
{
    public Guid Id { get; set; }
    public Guid CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public DateTime AppointmentDateTime { get; set; }
    public AppointmentStatus Status { get; set; }
    public decimal TotalPrice { get; set; }
    public int ServiceCount { get; set; }
}
