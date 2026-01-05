namespace Spa_Salon_BackEnd.Application.DTOs.Service;

public class CreateServiceDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int DurationMinutes { get; set; }
    public bool IsActive { get; set; } = true;
    public Guid EmployeeId { get; set; }
}
