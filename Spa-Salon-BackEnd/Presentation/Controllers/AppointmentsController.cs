using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spa_Salon_BackEnd.Application.DTOs.Appointment;
using Spa_Salon_BackEnd.Application.DTOs.Common;
using Spa_Salon_BackEnd.Application.Interfaces;
using Spa_Salon_BackEnd.Domain.Entities.Enums;

namespace Spa_Salon_BackEnd.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppointmentsController : ControllerBase
{
    private readonly IAppointmentService _appointmentService;
    private readonly ICustomerService _customerService;
    private readonly IEmployeeService _employeeService;

    public AppointmentsController(
        IAppointmentService appointmentService,
        ICustomerService customerService,
        IEmployeeService employeeService)
    {
        _appointmentService = appointmentService;
        _customerService = customerService;
        _employeeService = employeeService;
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<PagedResult<AppointmentDto>>> GetAll([FromQuery] PaginationParams paginationParams)
    {
        var currentUserId = GetCurrentUserId();
        var currentUserRole = GetCurrentUserRole();

        Guid? customerId = null;
        Guid? employeeId = null;

        if (currentUserRole == "Customer")
        {
            var customer = await _customerService.GetByUserIdAsync(currentUserId);
            if (customer != null)
            {
                customerId = customer.Id;
            }
        }
        else if (currentUserRole == "Employee")
        {
            var employee = await _employeeService.GetByUserIdAsync(currentUserId);
            if (employee != null)
            {
                employeeId = employee.Id;
            }
        }

        var result = await _appointmentService.GetAllAsync(paginationParams, customerId, employeeId);
        return Ok(result);
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<AppointmentDetailDto>> GetById(Guid id)
    {
        var result = await _appointmentService.GetByIdAsync(id);
        if (result == null) return NotFound();

        var currentUserId = GetCurrentUserId();
        var currentUserRole = GetCurrentUserRole();

        if (currentUserRole == "Customer")
        {
            var customer = await _customerService.GetByUserIdAsync(currentUserId);
            if (customer == null || result.CustomerId != customer.Id)
            {
                return Forbid();
            }
        }
        else if (currentUserRole == "Employee")
        {
            var employee = await _employeeService.GetByUserIdAsync(currentUserId);
            if (employee == null || !result.Services.Any(s => s.EmployeeId == employee.Id))
            {
                return Forbid();
            }
        }

        return Ok(result);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<AppointmentDto>> Create([FromBody] CreateAppointmentDto createDto)
    {
        var currentUserId = GetCurrentUserId();
        var currentUserRole = GetCurrentUserRole();

        var isManagerOrAdmin = currentUserRole == "Admin" || currentUserRole == "Manager";

        if (currentUserRole == "Employee")
        {
            return Forbid();
        }

        if (currentUserRole == "Customer")
        {
            var customer = await _customerService.GetByUserIdAsync(currentUserId);
            if (customer == null)
            {
                return BadRequest("Customer profile not found");
            }
            createDto.CustomerId = customer.Id;
        }

        if (createDto.CustomerId == Guid.Empty)
        {
            return BadRequest("CustomerId is required");
        }

        try
        {
            var result = await _appointmentService.CreateAsync(createDto, isManagerOrAdmin);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Authorize(Roles = "Admin,Manager")]
    [HttpPost("{id}/approve")]
    public async Task<IActionResult> Approve(Guid id)
    {
        var (success, errorMessage) = await _appointmentService.ApproveAsync(id);

        if (!success)
        {
            return BadRequest(new { message = errorMessage ?? "Failed to approve appointment" });
        }

        return Ok(new { message = "Appointment approved successfully" });
    }

    [Authorize(Roles = "Admin,Manager")]
    [HttpPost("{id}/reject")]
    public async Task<IActionResult> Reject(Guid id)
    {
        var success = await _appointmentService.RejectAsync(id);

        if (!success)
        {
            return BadRequest(new { message = "Failed to reject appointment. It may not be in Requested status." });
        }

        return Ok(new { message = "Appointment rejected successfully" });
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<AppointmentDto>> Update(Guid id, [FromBody] UpdateAppointmentDto updateDto)
    {
        var existingAppointment = await _appointmentService.GetByIdAsync(id);
        if (existingAppointment == null) return NotFound();

        var currentUserId = GetCurrentUserId();
        var currentUserRole = GetCurrentUserRole();

        if (currentUserRole == "Customer")
        {
            var customer = await _customerService.GetByUserIdAsync(currentUserId);
            if (customer == null || existingAppointment.CustomerId != customer.Id)
            {
                return Forbid();
            }
            if (updateDto.Status.HasValue && updateDto.Status.Value != AppointmentStatus.Cancelled)
            {
                return Forbid();
            }
        }

        var result = await _appointmentService.UpdateAsync(id, updateDto);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var existingAppointment = await _appointmentService.GetByIdAsync(id);
        if (existingAppointment == null) return NotFound();

        var currentUserId = GetCurrentUserId();
        var currentUserRole = GetCurrentUserRole();

        if (currentUserRole == "Customer")
        {
            var customer = await _customerService.GetByUserIdAsync(currentUserId);
            if (customer == null || existingAppointment.CustomerId != customer.Id)
            {
                return Forbid();
            }
        }
        else if (currentUserRole != "Admin" && currentUserRole != "Manager")
        {
            return Forbid();
        }

        var success = await _appointmentService.DeleteAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }

    [Authorize]
    [HttpGet("my")]
    public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetMyAppointments()
    {
        var currentUserId = GetCurrentUserId();
        var currentUserRole = GetCurrentUserRole();

        if (currentUserRole == "Customer")
        {
            var customer = await _customerService.GetByUserIdAsync(currentUserId);
            if (customer == null)
            {
                return Ok(new List<AppointmentDto>());
            }
            var result = await _appointmentService.GetByCustomerAsync(customer.Id);
            return Ok(result);
        }

        return BadRequest("Invalid role for this endpoint");
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
