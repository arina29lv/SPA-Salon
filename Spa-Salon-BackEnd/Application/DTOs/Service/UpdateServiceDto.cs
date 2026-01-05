namespace Spa_Salon_BackEnd.Application.DTOs.Service;

public class UpdateServiceDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal? Price { get; set; }
    public int? DurationMinutes { get; set; }
    public bool? IsActive { get; set; }
    public Guid? EmployeeId { get; set; }
}
