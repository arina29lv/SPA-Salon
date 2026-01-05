using Spa_Salon_BackEnd.Domain.Entities.Enums;

namespace Spa_Salon_BackEnd.Application.DTOs.User;

public class UpdateUserDto
{
    public string? Email { get; set; }
    public UserRole? Role { get; set; }
}
