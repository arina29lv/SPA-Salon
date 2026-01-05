namespace Spa_Salon_BackEnd.Application.DTOs.AppointmentService;

public class AppointmentServiceDto
{
    public Guid Id { get; set; }
    public Guid AppointmentId { get; set; }
    public Guid ServiceId { get; set; }
    public string ServiceName { get; set; } = string.Empty;
    public Guid EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public decimal Price { get; set; }
}
