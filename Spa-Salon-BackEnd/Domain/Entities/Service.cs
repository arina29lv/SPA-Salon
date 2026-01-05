namespace Spa_Salon_BackEnd.Domain.Entities;

public class Service
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int DurationMinutes { get; set; }
    public bool IsActive { get; set; } = true;

    public Guid EmployeeId { get; set; }
    public Employee Employee { get; set; } = null!;

    public ICollection<AppointmentService> AppointmentServices { get; set; } = new List<AppointmentService>();
}
