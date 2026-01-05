using Spa_Salon_BackEnd.Application.DTOs.AppointmentService;

namespace Spa_Salon_BackEnd.Application.DTOs.Appointment;

public class CreateAppointmentDto
{
    public Guid CustomerId { get; set; }
    public DateTime AppointmentDateTime { get; set; }
    public string? Notes { get; set; }
    public IEnumerable<CreateAppointmentServiceDto> Services { get; set; } = new List<CreateAppointmentServiceDto>();
}
