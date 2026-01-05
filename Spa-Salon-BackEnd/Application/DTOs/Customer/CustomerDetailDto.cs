using Spa_Salon_BackEnd.Domain.Entities.Enums;

namespace Spa_Salon_BackEnd.Application.DTOs.Customer;

public class CustomerDetailDto
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public DateTime? DateOfBirth { get; set; }
    public Guid? UserId { get; set; }
    public IEnumerable<CustomerAppointmentDto> Appointments { get; set; } = new List<CustomerAppointmentDto>();
}

public class CustomerAppointmentDto
{
    public Guid Id { get; set; }
    public DateTime AppointmentDateTime { get; set; }
    public AppointmentStatus Status { get; set; }
    public decimal TotalPrice { get; set; }
    public IEnumerable<AppointmentServiceSummaryDto> Services { get; set; } = new List<AppointmentServiceSummaryDto>();
}

public class AppointmentServiceSummaryDto
{
    public string ServiceName { get; set; } = string.Empty;
    public string EmployeeName { get; set; } = string.Empty;
    public decimal Price { get; set; }
}
