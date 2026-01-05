using Spa_Salon_BackEnd.Domain.Entities.Enums;

namespace Spa_Salon_BackEnd.Application.DTOs.Appointment;

public class UpdateAppointmentDto
{
    public DateTime? AppointmentDateTime { get; set; }
    public AppointmentStatus? Status { get; set; }
    public string? Notes { get; set; }
}
