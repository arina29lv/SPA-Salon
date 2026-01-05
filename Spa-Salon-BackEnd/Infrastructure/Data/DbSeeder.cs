using Spa_Salon_BackEnd.Domain.Entities;
using Spa_Salon_BackEnd.Domain.Entities.Enums;

namespace Spa_Salon_BackEnd.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (context.Users.Any()) return;

        var adminUser = new User
        {
            Id = Guid.NewGuid(),
            Email = "admin@spa.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            Role = UserRole.Admin,
            CreatedAt = DateTime.UtcNow
        };

        var managerUser = new User
        {
            Id = Guid.NewGuid(),
            Email = "manager@spa.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Manager123!"),
            Role = UserRole.Manager,
            CreatedAt = DateTime.UtcNow
        };

        var employeeUser1 = new User
        {
            Id = Guid.NewGuid(),
            Email = "emily@spa.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Employee123!"),
            Role = UserRole.Employee,
            CreatedAt = DateTime.UtcNow
        };

        var employeeUser2 = new User
        {
            Id = Guid.NewGuid(),
            Email = "james@spa.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Employee123!"),
            Role = UserRole.Employee,
            CreatedAt = DateTime.UtcNow
        };

        var employeeUser3 = new User
        {
            Id = Guid.NewGuid(),
            Email = "sarah@spa.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Employee123!"),
            Role = UserRole.Employee,
            CreatedAt = DateTime.UtcNow
        };

        var customerUser1 = new User
        {
            Id = Guid.NewGuid(),
            Email = "john.smith@email.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Customer123!"),
            Role = UserRole.Customer,
            CreatedAt = DateTime.UtcNow
        };

        var customerUser2 = new User
        {
            Id = Guid.NewGuid(),
            Email = "jennifer.white@email.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Customer123!"),
            Role = UserRole.Customer,
            CreatedAt = DateTime.UtcNow
        };

        var users = new List<User> { adminUser, managerUser, employeeUser1, employeeUser2, employeeUser3, customerUser1, customerUser2 };
        await context.Users.AddRangeAsync(users);
        await context.SaveChangesAsync();

        var employees = new List<Employee>
        {
            new Employee
            {
                Id = Guid.NewGuid(),
                FirstName = "Emily",
                LastName = "Davis",
                Email = "emily@spa.com",
                Phone = "+1-555-0101",
                Position = "Senior Hair Stylist",
                HireDate = DateTime.UtcNow.AddYears(-3),
                UserId = employeeUser1.Id
            },
            new Employee
            {
                Id = Guid.NewGuid(),
                FirstName = "James",
                LastName = "Wilson",
                Email = "james@spa.com",
                Phone = "+1-555-0102",
                Position = "Hair Stylist",
                HireDate = DateTime.UtcNow.AddYears(-2),
                UserId = employeeUser2.Id
            },
            new Employee
            {
                Id = Guid.NewGuid(),
                FirstName = "Sarah",
                LastName = "Miller",
                Email = "sarah@spa.com",
                Phone = "+1-555-0103",
                Position = "Massage Therapist",
                HireDate = DateTime.UtcNow.AddYears(-4),
                UserId = employeeUser3.Id
            },
            new Employee
            {
                Id = Guid.NewGuid(),
                FirstName = "David",
                LastName = "Taylor",
                Email = "david.taylor@spa.com",
                Phone = "+1-555-0104",
                Position = "Spa Specialist",
                HireDate = DateTime.UtcNow.AddYears(-1),
                UserId = null
            }
        };

        await context.Employees.AddRangeAsync(employees);
        await context.SaveChangesAsync();

        var customers = new List<Customer>
        {
            new Customer
            {
                Id = Guid.NewGuid(),
                FirstName = "John",
                LastName = "Smith",
                Email = "john.smith@email.com",
                Phone = "+1-555-1001",
                DateOfBirth = new DateTime(1985, 5, 15),
                UserId = customerUser1.Id
            },
            new Customer
            {
                Id = Guid.NewGuid(),
                FirstName = "Jennifer",
                LastName = "White",
                Email = "jennifer.white@email.com",
                Phone = "+1-555-1002",
                DateOfBirth = new DateTime(1990, 8, 22),
                UserId = customerUser2.Id
            },
            new Customer
            {
                Id = Guid.NewGuid(),
                FirstName = "Robert",
                LastName = "Anderson",
                Email = "robert.anderson@email.com",
                Phone = "+1-555-1003",
                DateOfBirth = new DateTime(1978, 3, 10),
                UserId = null
            },
            new Customer
            {
                Id = Guid.NewGuid(),
                FirstName = "Maria",
                LastName = "Garcia",
                Email = "maria.garcia@email.com",
                Phone = "+1-555-1004",
                DateOfBirth = new DateTime(1995, 11, 30),
                UserId = null
            },
            new Customer
            {
                Id = Guid.NewGuid(),
                FirstName = "William",
                LastName = "Martinez",
                Email = "william.martinez@email.com",
                Phone = "+1-555-1005",
                DateOfBirth = new DateTime(1982, 7, 8),
                UserId = null
            }
        };

        await context.Customers.AddRangeAsync(customers);
        await context.SaveChangesAsync();

        var services = new List<Service>
        {
            new Service
            {
                Id = Guid.NewGuid(),
                Name = "Haircut - Women",
                Description = "Professional haircut including wash and style",
                DurationMinutes = 60,
                Price = 50.00m,
                IsActive = true,
                EmployeeId = employees[0].Id
            },
            new Service
            {
                Id = Guid.NewGuid(),
                Name = "Haircut - Men",
                Description = "Professional men's haircut",
                DurationMinutes = 30,
                Price = 30.00m,
                IsActive = true,
                EmployeeId = employees[1].Id
            },
            new Service
            {
                Id = Guid.NewGuid(),
                Name = "Hair Coloring",
                Description = "Full hair coloring service",
                DurationMinutes = 120,
                Price = 100.00m,
                IsActive = true,
                EmployeeId = employees[0].Id
            },
            new Service
            {
                Id = Guid.NewGuid(),
                Name = "Hair Styling",
                Description = "Special occasion hair styling",
                DurationMinutes = 45,
                Price = 40.00m,
                IsActive = true,
                EmployeeId = employees[1].Id
            },
            new Service
            {
                Id = Guid.NewGuid(),
                Name = "Swedish Massage",
                Description = "Relaxing full-body Swedish massage",
                DurationMinutes = 60,
                Price = 80.00m,
                IsActive = true,
                EmployeeId = employees[2].Id
            },
            new Service
            {
                Id = Guid.NewGuid(),
                Name = "Deep Tissue Massage",
                Description = "Therapeutic deep tissue massage",
                DurationMinutes = 60,
                Price = 90.00m,
                IsActive = true,
                EmployeeId = employees[2].Id
            },
            new Service
            {
                Id = Guid.NewGuid(),
                Name = "Facial Treatment",
                Description = "Rejuvenating facial treatment",
                DurationMinutes = 45,
                Price = 70.00m,
                IsActive = true,
                EmployeeId = employees[3].Id
            },
            new Service
            {
                Id = Guid.NewGuid(),
                Name = "Hot Stone Therapy",
                Description = "Relaxing hot stone massage therapy",
                DurationMinutes = 90,
                Price = 120.00m,
                IsActive = true,
                EmployeeId = employees[2].Id
            }
        };

        await context.Services.AddRangeAsync(services);
        await context.SaveChangesAsync();

        var appointment1 = new Appointment
        {
            Id = Guid.NewGuid(),
            CustomerId = customers[0].Id,
            AppointmentDateTime = DateTime.UtcNow.AddDays(1).AddHours(10),
            Status = AppointmentStatus.Scheduled,
            Notes = "First time customer",
            TotalPrice = services[0].Price,
            CreatedAt = DateTime.UtcNow
        };

        var appointment2 = new Appointment
        {
            Id = Guid.NewGuid(),
            CustomerId = customers[1].Id,
            AppointmentDateTime = DateTime.UtcNow.AddDays(2).AddHours(14),
            Status = AppointmentStatus.Scheduled,
            Notes = "Prefers light pressure",
            TotalPrice = services[4].Price,
            CreatedAt = DateTime.UtcNow
        };

        var appointment3 = new Appointment
        {
            Id = Guid.NewGuid(),
            CustomerId = customers[2].Id,
            AppointmentDateTime = DateTime.UtcNow.AddDays(-2).AddHours(11),
            Status = AppointmentStatus.Completed,
            Notes = null,
            TotalPrice = services[1].Price,
            CreatedAt = DateTime.UtcNow.AddDays(-5)
        };

        var appointment4 = new Appointment
        {
            Id = Guid.NewGuid(),
            CustomerId = customers[3].Id,
            AppointmentDateTime = DateTime.UtcNow.AddDays(3).AddHours(15),
            Status = AppointmentStatus.Scheduled,
            Notes = "Sensitive skin - use gentle products",
            TotalPrice = services[6].Price,
            CreatedAt = DateTime.UtcNow
        };

        var appointment5 = new Appointment
        {
            Id = Guid.NewGuid(),
            CustomerId = customers[4].Id,
            AppointmentDateTime = DateTime.UtcNow.AddDays(-1).AddHours(16),
            Status = AppointmentStatus.Completed,
            Notes = "Focus on lower back",
            TotalPrice = services[5].Price,
            CreatedAt = DateTime.UtcNow.AddDays(-3)
        };

        var appointment6 = new Appointment
        {
            Id = Guid.NewGuid(),
            CustomerId = customers[0].Id,
            AppointmentDateTime = DateTime.UtcNow.AddDays(5).AddHours(13),
            Status = AppointmentStatus.Scheduled,
            Notes = null,
            TotalPrice = services[7].Price + services[6].Price,
            CreatedAt = DateTime.UtcNow
        };

        var appointment7 = new Appointment
        {
            Id = Guid.NewGuid(),
            CustomerId = customers[1].Id,
            AppointmentDateTime = DateTime.UtcNow.AddDays(-7).AddHours(14),
            Status = AppointmentStatus.Cancelled,
            Notes = "Customer cancelled - rescheduled",
            TotalPrice = services[4].Price,
            CreatedAt = DateTime.UtcNow.AddDays(-10)
        };

        var appointments = new List<Appointment> { appointment1, appointment2, appointment3, appointment4, appointment5, appointment6, appointment7 };
        await context.Appointments.AddRangeAsync(appointments);
        await context.SaveChangesAsync();

        var appointmentServices = new List<AppointmentService>
        {
            new AppointmentService
            {
                Id = Guid.NewGuid(),
                AppointmentId = appointment1.Id,
                ServiceId = services[0].Id,
                EmployeeId = employees[0].Id,
                Price = services[0].Price
            },
            new AppointmentService
            {
                Id = Guid.NewGuid(),
                AppointmentId = appointment2.Id,
                ServiceId = services[4].Id,
                EmployeeId = employees[2].Id,
                Price = services[4].Price
            },
            new AppointmentService
            {
                Id = Guid.NewGuid(),
                AppointmentId = appointment3.Id,
                ServiceId = services[1].Id,
                EmployeeId = employees[1].Id,
                Price = services[1].Price
            },
            new AppointmentService
            {
                Id = Guid.NewGuid(),
                AppointmentId = appointment4.Id,
                ServiceId = services[6].Id,
                EmployeeId = employees[3].Id,
                Price = services[6].Price
            },
            new AppointmentService
            {
                Id = Guid.NewGuid(),
                AppointmentId = appointment5.Id,
                ServiceId = services[5].Id,
                EmployeeId = employees[2].Id,
                Price = services[5].Price
            },
            new AppointmentService
            {
                Id = Guid.NewGuid(),
                AppointmentId = appointment6.Id,
                ServiceId = services[7].Id,
                EmployeeId = employees[2].Id,
                Price = services[7].Price
            },
            new AppointmentService
            {
                Id = Guid.NewGuid(),
                AppointmentId = appointment6.Id,
                ServiceId = services[6].Id,
                EmployeeId = employees[3].Id,
                Price = services[6].Price
            },
            new AppointmentService
            {
                Id = Guid.NewGuid(),
                AppointmentId = appointment7.Id,
                ServiceId = services[4].Id,
                EmployeeId = employees[2].Id,
                Price = services[4].Price
            }
        };

        await context.AppointmentServices.AddRangeAsync(appointmentServices);
        await context.SaveChangesAsync();
    }
}
