using Spa_Salon_BackEnd.Application.DTOs.Common;
using Spa_Salon_BackEnd.Application.DTOs.User;

namespace Spa_Salon_BackEnd.Application.Interfaces;

public interface IUserService
{
    Task<PagedResult<UserDto>> GetAllAsync(PaginationParams paginationParams);
    Task<UserDetailDto?> GetByIdAsync(Guid id);
    Task<UserDto> CreateAsync(CreateUserDto createDto);
    Task<UserDto?> UpdateAsync(Guid id, UpdateUserDto updateDto);
    Task<bool> DeleteAsync(Guid id);
}
