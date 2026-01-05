using Spa_Salon_BackEnd.Application.DTOs.User;

namespace Spa_Salon_BackEnd.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
    Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
    Task<UserDto> GetCurrentUserAsync(Guid userId);
}
