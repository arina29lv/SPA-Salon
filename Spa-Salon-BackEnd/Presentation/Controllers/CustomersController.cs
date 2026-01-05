using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spa_Salon_BackEnd.Application.DTOs.Common;
using Spa_Salon_BackEnd.Application.DTOs.Customer;
using Spa_Salon_BackEnd.Application.Interfaces;

namespace Spa_Salon_BackEnd.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly ICustomerService _customerService;

    public CustomersController(ICustomerService customerService)
    {
        _customerService = customerService;
    }

    [Authorize(Policy = "ManagerOrAdmin")]
    [HttpGet]
    public async Task<ActionResult<PagedResult<CustomerDto>>> GetAll([FromQuery] PaginationParams paginationParams)
    {
        var result = await _customerService.GetAllAsync(paginationParams);
        return Ok(result);
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<CustomerDetailDto>> GetById(Guid id)
    {
        var currentUserId = GetCurrentUserId();
        var currentUserRole = GetCurrentUserRole();

        var result = await _customerService.GetByIdAsync(id);
        if (result == null) return NotFound();

        if (currentUserRole == "Customer")
        {
            if (result.UserId != currentUserId)
            {
                return Forbid();
            }
        }

        return Ok(result);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<CustomerDto>> GetMyProfile()
    {
        var currentUserId = GetCurrentUserId();
        var result = await _customerService.GetByUserIdAsync(currentUserId);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [Authorize(Policy = "ManagerOrAdmin")]
    [HttpPost]
    public async Task<ActionResult<CustomerDto>> Create([FromBody] CreateCustomerDto createDto)
    {
        var result = await _customerService.CreateAsync(createDto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<CustomerDto>> Update(Guid id, [FromBody] UpdateCustomerDto updateDto)
    {
        var currentUserId = GetCurrentUserId();
        var currentUserRole = GetCurrentUserRole();

        var existing = await _customerService.GetByIdAsync(id);
        if (existing == null) return NotFound();

        if (currentUserRole == "Customer")
        {
            if (existing.UserId != currentUserId)
            {
                return Forbid();
            }
        }

        var result = await _customerService.UpdateAsync(id, updateDto);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await _customerService.DeleteAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }

    private Guid GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(claim, out var id) ? id : Guid.Empty;
    }

    private string GetCurrentUserRole()
    {
        return User.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty;
    }
}
