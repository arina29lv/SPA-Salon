using Spa_Salon_BackEnd.Domain.Entities.Enums;

namespace Spa_Salon_BackEnd.Application.DTOs.Employee;

public class EmployeeDetailDto
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public DateTime HireDate { get; set; }
    public Guid? UserId { get; set; }
    public IEnumerable<EmployeeAppointmentServiceDto> AppointmentServices { get; set; } = new List<EmployeeAppointmentServiceDto>();
}

public class EmployeeAppointmentServiceDto
{
    public Guid Id { get; set; }
    public string ServiceName { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public DateTime AppointmentDateTime { get; set; }
    public AppointmentStatus Status { get; set; }
    public decimal Price { get; set; }
}
