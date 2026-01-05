using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spa_Salon_BackEnd.Application.DTOs.Common;
using Spa_Salon_BackEnd.Application.DTOs.Service;
using Spa_Salon_BackEnd.Application.Interfaces;

namespace Spa_Salon_BackEnd.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServicesController : ControllerBase
{
    private readonly IServiceService _serviceService;

    public ServicesController(IServiceService serviceService)
    {
        _serviceService = serviceService;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<ServiceDto>>> GetAll([FromQuery] PaginationParams paginationParams)
    {
        var result = await _serviceService.GetAllAsync(paginationParams);
        return Ok(result);
    }

    [HttpGet("active")]
    public async Task<ActionResult<IEnumerable<ServiceDto>>> GetActiveServices()
    {
        var result = await _serviceService.GetActiveServicesAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ServiceDetailDto>> GetById(Guid id)
    {
        var result = await _serviceService.GetByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [Authorize(Policy = "ManagerOrAdmin")]
    [HttpPost]
    public async Task<ActionResult<ServiceDto>> Create([FromBody] CreateServiceDto createDto)
    {
        var result = await _serviceService.CreateAsync(createDto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [Authorize(Policy = "ManagerOrAdmin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ServiceDto>> Update(Guid id, [FromBody] UpdateServiceDto updateDto)
    {
        var result = await _serviceService.UpdateAsync(id, updateDto);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await _serviceService.DeleteAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }
}
