using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Spa_Salon_BackEnd.Application.DTOs.User;
using Spa_Salon_BackEnd.Application.Interfaces;
using Spa_Salon_BackEnd.Domain.Entities;
using Spa_Salon_BackEnd.Domain.Entities.Enums;
using Spa_Salon_BackEnd.Domain.Interfaces;

namespace Spa_Salon_BackEnd.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly ICustomerRepository _customerRepository;
    private readonly IConfiguration _configuration;
    private readonly IMapper _mapper;

    public AuthService(
        IUserRepository userRepository,
        ICustomerRepository customerRepository,
        IConfiguration configuration,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _customerRepository = customerRepository;
        _configuration = configuration;
        _mapper = mapper;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
    {
        var user = await _userRepository.GetByEmailAsync(loginDto.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid email or password");
        }

        var token = GenerateJwtToken(user);

        string? firstName = null;
        string? lastName = null;
        if (user.Customer != null)
        {
            firstName = user.Customer.FirstName;
            lastName = user.Customer.LastName;
        }
        else if (user.Employee != null)
        {
            firstName = user.Employee.FirstName;
            lastName = user.Employee.LastName;
        }

        return new AuthResponseDto
        {
            Id = user.Id,
            Email = user.Email,
            Role = user.Role,
            Token = token,
            FirstName = firstName,
            LastName = lastName
        };
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
    {
        var existingUser = await _userRepository.GetByEmailAsync(registerDto.Email);

        if (existingUser != null)
        {
            throw new InvalidOperationException("Email is already registered");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = registerDto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
            Role = UserRole.Customer,
            CreatedAt = DateTime.UtcNow
        };

        await _userRepository.AddAsync(user);

        var customer = new Customer
        {
            Id = Guid.NewGuid(),
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            Email = registerDto.Email,
            Phone = registerDto.Phone ?? string.Empty,
            UserId = user.Id
        };

        await _customerRepository.AddAsync(customer);

        var token = GenerateJwtToken(user);

        return new AuthResponseDto
        {
            Id = user.Id,
            Email = user.Email,
            Role = user.Role,
            Token = token,
            FirstName = customer.FirstName,
            LastName = customer.LastName
        };
    }

    public async Task<UserDto> GetCurrentUserAsync(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);

        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        return _mapper.Map<UserDto>(user);
    }

    private string GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
