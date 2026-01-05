namespace Spa_Salon_BackEnd.Application.DTOs.AppointmentService;

public class CreateAppointmentServiceDto
{
    public Guid ServiceId { get; set; }
    public Guid EmployeeId { get; set; }
    public decimal? Price { get; set; }
}
