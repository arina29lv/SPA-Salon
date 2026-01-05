using AutoMapper;
using Spa_Salon_BackEnd.Application.DTOs.Common;
using Spa_Salon_BackEnd.Application.DTOs.Customer;
using Spa_Salon_BackEnd.Application.Interfaces;
using Spa_Salon_BackEnd.Domain.Entities;
using Spa_Salon_BackEnd.Domain.Entities.Enums;
using Spa_Salon_BackEnd.Domain.Interfaces;

namespace Spa_Salon_BackEnd.Application.Services;

public class CustomerService : ICustomerService
{
    private readonly ICustomerRepository _customerRepository;
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public CustomerService(ICustomerRepository customerRepository, IUserRepository userRepository, IMapper mapper)
    {
        _customerRepository = customerRepository;
        _userRepository = userRepository;
        _mapper = mapper;
    }

    public async Task<PagedResult<CustomerDto>> GetAllAsync(PaginationParams paginationParams)
    {
        var (items, totalCount) = await _customerRepository.GetPagedWithDetailsAsync(
            paginationParams.Page,
            paginationParams.PageSize);

        return new PagedResult<CustomerDto>
        {
            Items = _mapper.Map<IEnumerable<CustomerDto>>(items),
            TotalCount = totalCount,
            Page = paginationParams.Page,
            PageSize = paginationParams.PageSize
        };
    }

    public async Task<CustomerDetailDto?> GetByIdAsync(Guid id)
    {
        var customer = await _customerRepository.GetByIdWithDetailsAsync(id);
        if (customer == null) return null;

        return _mapper.Map<CustomerDetailDto>(customer);
    }

    public async Task<CustomerDto?> GetByUserIdAsync(Guid userId)
    {
        var customer = await _customerRepository.GetByUserIdAsync(userId);
        if (customer == null) return null;

        return _mapper.Map<CustomerDto>(customer);
    }

    public async Task<CustomerDto> CreateAsync(CreateCustomerDto createDto)
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
            Role = UserRole.Customer,
            CreatedAt = DateTime.UtcNow
        };

        await _userRepository.AddAsync(user);

        var customer = new Customer
        {
            Id = Guid.NewGuid(),
            FirstName = createDto.FirstName,
            LastName = createDto.LastName,
            Email = createDto.Email,
            Phone = createDto.Phone ?? string.Empty,
            DateOfBirth = createDto.DateOfBirth,
            UserId = user.Id
        };

        await _customerRepository.AddAsync(customer);

        return _mapper.Map<CustomerDto>(customer);
    }

    public async Task<CustomerDto?> UpdateAsync(Guid id, UpdateCustomerDto updateDto)
    {
        var customer = await _customerRepository.GetByIdAsync(id);
        if (customer == null) return null;

        if (updateDto.FirstName != null) customer.FirstName = updateDto.FirstName;
        if (updateDto.LastName != null) customer.LastName = updateDto.LastName;
        if (updateDto.Email != null) customer.Email = updateDto.Email;
        if (updateDto.Phone != null) customer.Phone = updateDto.Phone;
        if (updateDto.DateOfBirth.HasValue) customer.DateOfBirth = updateDto.DateOfBirth;

        await _customerRepository.UpdateAsync(customer);

        return _mapper.Map<CustomerDto>(customer);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var customer = await _customerRepository.GetByIdAsync(id);
        if (customer == null) return false;

        await _customerRepository.DeleteAsync(customer);
        return true;
    }
}
