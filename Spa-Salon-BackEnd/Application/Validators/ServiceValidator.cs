using FluentValidation;
using Spa_Salon_BackEnd.Application.DTOs.Service;

namespace Spa_Salon_BackEnd.Application.Validators;

public class CreateServiceDtoValidator : AbstractValidator<CreateServiceDto>
{
    public CreateServiceDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Service name is required")
            .MaximumLength(100).WithMessage("Service name must not exceed 100 characters");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters")
            .When(x => x.Description != null);

        RuleFor(x => x.DurationMinutes)
            .GreaterThan(0).WithMessage("Duration must be greater than 0")
            .LessThanOrEqualTo(480).WithMessage("Duration must not exceed 480 minutes (8 hours)");

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0).WithMessage("Price must be a positive number")
            .LessThanOrEqualTo(10000).WithMessage("Price must not exceed 10000");

        RuleFor(x => x.EmployeeId)
            .NotEmpty().WithMessage("Employee is required");
    }
}

public class UpdateServiceDtoValidator : AbstractValidator<UpdateServiceDto>
{
    public UpdateServiceDtoValidator()
    {
        RuleFor(x => x.Name)
            .MaximumLength(100).WithMessage("Service name must not exceed 100 characters")
            .When(x => x.Name != null);

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters")
            .When(x => x.Description != null);

        RuleFor(x => x.DurationMinutes)
            .GreaterThan(0).WithMessage("Duration must be greater than 0")
            .LessThanOrEqualTo(480).WithMessage("Duration must not exceed 480 minutes (8 hours)")
            .When(x => x.DurationMinutes != null);

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0).WithMessage("Price must be a positive number")
            .LessThanOrEqualTo(10000).WithMessage("Price must not exceed 10000")
            .When(x => x.Price != null);

        RuleFor(x => x.EmployeeId)
            .NotEqual(Guid.Empty).WithMessage("Invalid employee")
            .When(x => x.EmployeeId.HasValue);
    }
}
