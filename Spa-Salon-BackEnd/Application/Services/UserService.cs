using AutoMapper;
using Spa_Salon_BackEnd.Application.DTOs.Common;
using Spa_Salon_BackEnd.Application.DTOs.User;
using Spa_Salon_BackEnd.Application.Interfaces;
using Spa_Salon_BackEnd.Domain.Entities;
using Spa_Salon_BackEnd.Domain.Entities.Enums;
using Spa_Salon_BackEnd.Domain.Interfaces;

namespace Spa_Salon_BackEnd.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly ICustomerRepository _customerRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IMapper _mapper;

    public UserService(
        IUserRepository userRepository,
        ICustomerRepository customerRepository,
        IEmployeeRepository employeeRepository,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _customerRepository = customerRepository;
        _employeeRepository = employeeRepository;
        _mapper = mapper;
    }

    public async Task<PagedResult<UserDto>> GetAllAsync(PaginationParams paginationParams)
    {
        var (users, totalCount) = await _userRepository.GetPagedAsync(
            paginationParams.Page,
            paginationParams.PageSize
        );

        return new PagedResult<UserDto>
        {
            Items = _mapper.Map<IEnumerable<UserDto>>(users),
            TotalCount = totalCount,
            Page = paginationParams.Page,
            PageSize = paginationParams.PageSize
        };
    }

    public async Task<UserDetailDto?> GetByIdAsync(Guid id)
    {
        var user = await _userRepository.GetByIdWithDetailsAsync(id);
        if (user == null) return null;

        return _mapper.Map<UserDetailDto>(user);
    }

    public async Task<UserDto> CreateAsync(CreateUserDto createDto)
    {
        var existingUser = await _userRepository.GetByEmailAsync(createDto.Email);
        if (existingUser != null)
        {
            throw new InvalidOperationException("Email is already registered");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = createDto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(createDto.Password),
            Role = createDto.Role,
            CreatedAt = DateTime.UtcNow
        };

        await _userRepository.AddAsync(user);

        if (createDto.Role == UserRole.Customer)
        {
            var customer = new Customer
            {
                Id = Guid.NewGuid(),
                FirstName = createDto.FirstName,
                LastName = createDto.LastName,
                Email = createDto.Email,
                Phone = createDto.Phone ?? string.Empty,
                UserId = user.Id
            };
            await _customerRepository.AddAsync(customer);
        }
        else
        {
            var employee = new Employee
            {
                Id = Guid.NewGuid(),
                FirstName = createDto.FirstName,
                LastName = createDto.LastName,
                Email = createDto.Email,
                Phone = createDto.Phone ?? string.Empty,
                Position = createDto.Position ?? "Staff",
                HireDate = createDto.HireDate ?? DateTime.UtcNow,
                UserId = user.Id
            };
            await _employeeRepository.AddAsync(employee);
        }

        return _mapper.Map<UserDto>(user);
    }

    public async Task<UserDto?> UpdateAsync(Guid id, UpdateUserDto updateDto)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null) return null;

        if (updateDto.Email != null) user.Email = updateDto.Email;
        if (updateDto.Role.HasValue) user.Role = updateDto.Role.Value;

        await _userRepository.UpdateAsync(user);

        return _mapper.Map<UserDto>(user);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null) return false;

        await _userRepository.DeleteAsync(user);
        return true;
    }
}
