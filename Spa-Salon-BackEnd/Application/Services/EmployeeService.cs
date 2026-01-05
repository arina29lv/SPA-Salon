using AutoMapper;
using Spa_Salon_BackEnd.Application.DTOs.Common;
using Spa_Salon_BackEnd.Application.DTOs.Employee;
using Spa_Salon_BackEnd.Application.Interfaces;
using Spa_Salon_BackEnd.Domain.Entities;
using Spa_Salon_BackEnd.Domain.Entities.Enums;
using Spa_Salon_BackEnd.Domain.Interfaces;

namespace Spa_Salon_BackEnd.Application.Services;

public class EmployeeService : IEmployeeService
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public EmployeeService(IEmployeeRepository employeeRepository, IUserRepository userRepository, IMapper mapper)
    {
        _employeeRepository = employeeRepository;
        _userRepository = userRepository;
        _mapper = mapper;
    }

    public async Task<PagedResult<EmployeeDto>> GetAllAsync(PaginationParams paginationParams)
    {
        var (items, totalCount) = await _employeeRepository.GetPagedWithDetailsAsync(
            paginationParams.Page,
            paginationParams.PageSize);

        return new PagedResult<EmployeeDto>
        {
            Items = _mapper.Map<IEnumerable<EmployeeDto>>(items),
            TotalCount = totalCount,
            Page = paginationParams.Page,
            PageSize = paginationParams.PageSize
        };
    }

    public async Task<IEnumerable<EmployeeDto>> GetAllListAsync()
    {
        var employees = await _employeeRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<EmployeeDto>>(employees);
    }

    public async Task<EmployeeDetailDto?> GetByIdAsync(Guid id)
    {
        var employee = await _employeeRepository.GetByIdWithDetailsAsync(id);
        if (employee == null) return null;

        return _mapper.Map<EmployeeDetailDto>(employee);
    }

    public async Task<EmployeeDto?> GetByUserIdAsync(Guid userId)
    {
        var employee = await _employeeRepository.GetByUserIdAsync(userId);
        if (employee == null) return null;

        return _mapper.Map<EmployeeDto>(employee);
    }

    public async Task<EmployeeDto> CreateAsync(CreateEmployeeDto createDto)
    {
        var existingUser = await _userRepository.GetByEmailAsync(createDto.Email);
        if (existingUser != null)
        {
            throw new InvalidOperationException("A user with this email already exists");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = createDto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(createDto.Password),
            Role = UserRole.Employee,
            CreatedAt = DateTime.UtcNow
        };

        await _userRepository.AddAsync(user);

        var employee = new Employee
        {
            Id = Guid.NewGuid(),
            FirstName = createDto.FirstName,
            LastName = createDto.LastName,
            Email = createDto.Email,
            Phone = createDto.Phone ?? string.Empty,
            Position = createDto.Position,
            HireDate = createDto.HireDate,
            UserId = user.Id
        };

        await _employeeRepository.AddAsync(employee);

        return _mapper.Map<EmployeeDto>(employee);
    }

    public async Task<EmployeeDto?> UpdateAsync(Guid id, UpdateEmployeeDto updateDto)
    {
        var employee = await _employeeRepository.GetByIdAsync(id);
        if (employee == null) return null;

        if (updateDto.FirstName != null) employee.FirstName = updateDto.FirstName;
        if (updateDto.LastName != null) employee.LastName = updateDto.LastName;
        if (updateDto.Email != null) employee.Email = updateDto.Email;
        if (updateDto.Phone != null) employee.Phone = updateDto.Phone;
        if (updateDto.Position != null) employee.Position = updateDto.Position;

        await _employeeRepository.UpdateAsync(employee);

        return _mapper.Map<EmployeeDto>(employee);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var employee = await _employeeRepository.GetByIdAsync(id);
        if (employee == null) return false;

        await _employeeRepository.DeleteAsync(employee);
        return true;
    }
}
