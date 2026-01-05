using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spa_Salon_BackEnd.Application.DTOs.Common;
using Spa_Salon_BackEnd.Application.DTOs.Employee;
using Spa_Salon_BackEnd.Application.Interfaces;

namespace Spa_Salon_BackEnd.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeesController : ControllerBase
{
    private readonly IEmployeeService _employeeService;

    public EmployeesController(IEmployeeService employeeService)
    {
        _employeeService = employeeService;
    }

    [Authorize(Policy = "ManagerOrAdmin")]
    [HttpGet]
    public async Task<ActionResult<PagedResult<EmployeeDto>>> GetAll([FromQuery] PaginationParams paginationParams)
    {
        var result = await _employeeService.GetAllAsync(paginationParams);
        return Ok(result);
    }

    [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetAllList()
    {
        var result = await _employeeService.GetAllListAsync();
        return Ok(result);
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<EmployeeDetailDto>> GetById(Guid id)
    {
        var currentUserId = GetCurrentUserId();
        var currentUserRole = GetCurrentUserRole();

        var result = await _employeeService.GetByIdAsync(id);
        if (result == null) return NotFound();

        if (currentUserRole == "Employee")
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
    public async Task<ActionResult<EmployeeDto>> GetMyProfile()
    {
        var currentUserId = GetCurrentUserId();
        var result = await _employeeService.GetByUserIdAsync(currentUserId);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPost]
    public async Task<ActionResult<EmployeeDto>> Create([FromBody] CreateEmployeeDto createDto)
    {
        var result = await _employeeService.CreateAsync(createDto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<EmployeeDto>> Update(Guid id, [FromBody] UpdateEmployeeDto updateDto)
    {
        var currentUserId = GetCurrentUserId();
        var currentUserRole = GetCurrentUserRole();

        var existing = await _employeeService.GetByIdAsync(id);
        if (existing == null) return NotFound();

        if (currentUserRole == "Employee")
        {
            if (existing.UserId != currentUserId)
            {
                return Forbid();
            }
        }
        else if (currentUserRole != "Manager" && currentUserRole != "Admin")
        {
            return Forbid();
        }

        var result = await _employeeService.UpdateAsync(id, updateDto);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await _employeeService.DeleteAsync(id);
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
