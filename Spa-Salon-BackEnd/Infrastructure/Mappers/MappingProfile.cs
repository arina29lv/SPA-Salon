using AutoMapper;
using Spa_Salon_BackEnd.Application.DTOs.Appointment;
using Spa_Salon_BackEnd.Application.DTOs.Customer;
using Spa_Salon_BackEnd.Application.DTOs.Employee;
using Spa_Salon_BackEnd.Application.DTOs.Service;
using Spa_Salon_BackEnd.Application.DTOs.User;
using Spa_Salon_BackEnd.Domain.Entities;

namespace Spa_Salon_BackEnd.Infrastructure.Mappers;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Customer, CustomerDto>()
            .ForMember(dest => dest.HasUserAccount, opt => opt.MapFrom(src => src.UserId.HasValue));

        CreateMap<Customer, CustomerDetailDto>();

        CreateMap<Appointment, CustomerAppointmentDto>()
            .ForMember(dest => dest.Services, opt => opt.MapFrom(src => src.AppointmentServices));

        CreateMap<AppointmentService, AppointmentServiceSummaryDto>()
            .ForMember(dest => dest.ServiceName, opt => opt.MapFrom(src => src.Service.Name))
            .ForMember(dest => dest.EmployeeName, opt => opt.MapFrom(src => $"{src.Employee.FirstName} {src.Employee.LastName}"));

        CreateMap<Employee, EmployeeDto>()
            .ForMember(dest => dest.HasUserAccount, opt => opt.MapFrom(src => src.UserId.HasValue));

        CreateMap<Employee, EmployeeDetailDto>();

        CreateMap<AppointmentService, EmployeeAppointmentServiceDto>()
            .ForMember(dest => dest.ServiceName, opt => opt.MapFrom(src => src.Service.Name))
            .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => $"{src.Appointment.Customer.FirstName} {src.Appointment.Customer.LastName}"))
            .ForMember(dest => dest.AppointmentDateTime, opt => opt.MapFrom(src => src.Appointment.AppointmentDateTime))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Appointment.Status));

        CreateMap<Service, ServiceDto>()
            .ForMember(dest => dest.EmployeeName, opt => opt.MapFrom(src => $"{src.Employee.FirstName} {src.Employee.LastName}"));

        CreateMap<Service, ServiceDetailDto>()
            .ForMember(dest => dest.EmployeeFirstName, opt => opt.MapFrom(src => src.Employee.FirstName))
            .ForMember(dest => dest.EmployeeLastName, opt => opt.MapFrom(src => src.Employee.LastName))
            .ForMember(dest => dest.EmployeePosition, opt => opt.MapFrom(src => src.Employee.Position));

        CreateMap<Appointment, AppointmentDto>()
            .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => $"{src.Customer.FirstName} {src.Customer.LastName}"))
            .ForMember(dest => dest.ServiceCount, opt => opt.MapFrom(src => src.AppointmentServices.Count));

        CreateMap<Appointment, AppointmentDetailDto>()
            .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => $"{src.Customer.FirstName} {src.Customer.LastName}"))
            .ForMember(dest => dest.CustomerEmail, opt => opt.MapFrom(src => src.Customer.Email))
            .ForMember(dest => dest.CustomerPhone, opt => opt.MapFrom(src => src.Customer.Phone))
            .ForMember(dest => dest.Services, opt => opt.MapFrom(src => src.AppointmentServices));

        CreateMap<AppointmentService, AppointmentServiceDetailDto>()
            .ForMember(dest => dest.ServiceName, opt => opt.MapFrom(src => src.Service.Name))
            .ForMember(dest => dest.DurationMinutes, opt => opt.MapFrom(src => src.Service.DurationMinutes))
            .ForMember(dest => dest.EmployeeName, opt => opt.MapFrom(src => $"{src.Employee.FirstName} {src.Employee.LastName}"));

        CreateMap<User, UserDto>();

        CreateMap<User, UserDetailDto>();

        CreateMap<Customer, CustomerInfoDto>();

        CreateMap<Employee, EmployeeInfoDto>();
    }
}
