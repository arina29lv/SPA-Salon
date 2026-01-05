using FluentValidation;
using Spa_Salon_BackEnd.Application.DTOs.Appointment;
using Spa_Salon_BackEnd.Application.DTOs.AppointmentService;

namespace Spa_Salon_BackEnd.Application.Validators;

public class CreateAppointmentDtoValidator : AbstractValidator<CreateAppointmentDto>
{
    public CreateAppointmentDtoValidator()
    {
        RuleFor(x => x.AppointmentDateTime)
            .GreaterThan(DateTime.UtcNow).WithMessage("Appointment date must be in the future");

        RuleFor(x => x.Services)
            .NotEmpty().WithMessage("At least one service is required");

        RuleForEach(x => x.Services)
            .SetValidator(new CreateAppointmentServiceDtoValidator());

        RuleFor(x => x.Notes)
            .MaximumLength(500).WithMessage("Notes must not exceed 500 characters")
            .When(x => x.Notes != null);
    }
}

public class CreateAppointmentServiceDtoValidator : AbstractValidator<CreateAppointmentServiceDto>
{
    public CreateAppointmentServiceDtoValidator()
    {
        RuleFor(x => x.ServiceId)
            .NotEmpty().WithMessage("Service is required");

        RuleFor(x => x.EmployeeId)
            .NotEmpty().WithMessage("Employee is required");

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0).WithMessage("Price must be a positive number")
            .When(x => x.Price.HasValue);
    }
}

public class UpdateAppointmentDtoValidator : AbstractValidator<UpdateAppointmentDto>
{
    public UpdateAppointmentDtoValidator()
    {
        RuleFor(x => x.AppointmentDateTime)
            .GreaterThan(DateTime.UtcNow).WithMessage("Appointment date must be in the future")
            .When(x => x.AppointmentDateTime != null);

        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Invalid status")
            .When(x => x.Status != null);

        RuleFor(x => x.Notes)
            .MaximumLength(500).WithMessage("Notes must not exceed 500 characters")
            .When(x => x.Notes != null);
    }
}
