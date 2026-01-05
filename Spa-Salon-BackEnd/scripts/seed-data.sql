PRAGMA foreign_keys = ON;

-- Admin: admin@spa.com / Admin123!
INSERT INTO Users (Id, Email, PasswordHash, Role, CreatedAt) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@spa.com', '$2a$11$K7.MsHBqZQPpq4IzP9N8EeQH1zPBQBZzJqxJ1YzW7kqJhJq9RzZNe', 4, datetime('now'));

-- Manager: manager@spa.com / Manager123!
INSERT INTO Users (Id, Email, PasswordHash, Role, CreatedAt) VALUES
('22222222-2222-2222-2222-222222222222', 'manager@spa.com', '$2a$11$K7.MsHBqZQPpq4IzP9N8EeQH1zPBQBZzJqxJ1YzW7kqJhJq9RzZNe', 3, datetime('now'));

-- Employee: emily@spa.com / Employee123!
INSERT INTO Users (Id, Email, PasswordHash, Role, CreatedAt) VALUES
('33333333-3333-3333-3333-333333333333', 'emily@spa.com', '$2a$11$K7.MsHBqZQPpq4IzP9N8EeQH1zPBQBZzJqxJ1YzW7kqJhJq9RzZNe', 2, datetime('now'));

-- Employee: james@spa.com / Employee123!
INSERT INTO Users (Id, Email, PasswordHash, Role, CreatedAt) VALUES
('44444444-4444-4444-4444-444444444444', 'james@spa.com', '$2a$11$K7.MsHBqZQPpq4IzP9N8EeQH1zPBQBZzJqxJ1YzW7kqJhJq9RzZNe', 2, datetime('now'));

-- Employee: sarah@spa.com / Employee123!
INSERT INTO Users (Id, Email, PasswordHash, Role, CreatedAt) VALUES
('55555555-5555-5555-5555-555555555555', 'sarah@spa.com', '$2a$11$K7.MsHBqZQPpq4IzP9N8EeQH1zPBQBZzJqxJ1YzW7kqJhJq9RzZNe', 2, datetime('now'));

-- Customer: john.smith@email.com / Customer123!
INSERT INTO Users (Id, Email, PasswordHash, Role, CreatedAt) VALUES
('66666666-6666-6666-6666-666666666666', 'john.smith@email.com', '$2a$11$K7.MsHBqZQPpq4IzP9N8EeQH1zPBQBZzJqxJ1YzW7kqJhJq9RzZNe', 1, datetime('now'));

-- Customer: jennifer.white@email.com / Customer123!
INSERT INTO Users (Id, Email, PasswordHash, Role, CreatedAt) VALUES
('77777777-7777-7777-7777-777777777777', 'jennifer.white@email.com', '$2a$11$K7.MsHBqZQPpq4IzP9N8EeQH1zPBQBZzJqxJ1YzW7kqJhJq9RzZNe', 1, datetime('now'));


INSERT INTO Employees (Id, FirstName, LastName, Email, Phone, Position, HireDate, UserId) VALUES
('eeee1111-1111-1111-1111-111111111111', 'Emily', 'Davis', 'emily@spa.com', '+1-555-0101', 'Senior Hair Stylist', date('now', '-3 years'), '33333333-3333-3333-3333-333333333333');

INSERT INTO Employees (Id, FirstName, LastName, Email, Phone, Position, HireDate, UserId) VALUES
('eeee2222-2222-2222-2222-222222222222', 'James', 'Wilson', 'james@spa.com', '+1-555-0102', 'Hair Stylist', date('now', '-2 years'), '44444444-4444-4444-4444-444444444444');

INSERT INTO Employees (Id, FirstName, LastName, Email, Phone, Position, HireDate, UserId) VALUES
('eeee3333-3333-3333-3333-333333333333', 'Sarah', 'Miller', 'sarah@spa.com', '+1-555-0103', 'Massage Therapist', date('now', '-4 years'), '55555555-5555-5555-5555-555555555555');

INSERT INTO Employees (Id, FirstName, LastName, Email, Phone, Position, HireDate, UserId) VALUES
('eeee4444-4444-4444-4444-444444444444', 'David', 'Taylor', 'david.taylor@spa.com', '+1-555-0104', 'Spa Specialist', date('now', '-1 years'), NULL);


INSERT INTO Customers (Id, FirstName, LastName, Email, Phone, DateOfBirth, UserId) VALUES
('cccc1111-1111-1111-1111-111111111111', 'John', 'Smith', 'john.smith@email.com', '+1-555-1001', '1985-05-15', '66666666-6666-6666-6666-666666666666');

INSERT INTO Customers (Id, FirstName, LastName, Email, Phone, DateOfBirth, UserId) VALUES
('cccc2222-2222-2222-2222-222222222222', 'Jennifer', 'White', 'jennifer.white@email.com', '+1-555-1002', '1990-08-22', '77777777-7777-7777-7777-777777777777');

INSERT INTO Customers (Id, FirstName, LastName, Email, Phone, DateOfBirth, UserId) VALUES
('cccc3333-3333-3333-3333-333333333333', 'Robert', 'Anderson', 'robert.anderson@email.com', '+1-555-1003', '1978-03-10', NULL);

INSERT INTO Customers (Id, FirstName, LastName, Email, Phone, DateOfBirth, UserId) VALUES
('cccc4444-4444-4444-4444-444444444444', 'Maria', 'Garcia', 'maria.garcia@email.com', '+1-555-1004', '1995-11-30', NULL);

INSERT INTO Customers (Id, FirstName, LastName, Email, Phone, DateOfBirth, UserId) VALUES
('cccc5555-5555-5555-5555-555555555555', 'William', 'Martinez', 'william.martinez@email.com', '+1-555-1005', '1982-07-08', NULL);


INSERT INTO Services (Id, Name, Description, Price, DurationMinutes, IsActive, EmployeeId) VALUES
('ssss1111-1111-1111-1111-111111111111', 'Haircut - Women', 'Professional haircut including wash and style', 50.00, 60, 1, 'eeee1111-1111-1111-1111-111111111111');

INSERT INTO Services (Id, Name, Description, Price, DurationMinutes, IsActive, EmployeeId) VALUES
('ssss2222-2222-2222-2222-222222222222', 'Haircut - Men', 'Professional mens haircut', 30.00, 30, 1, 'eeee2222-2222-2222-2222-222222222222');

INSERT INTO Services (Id, Name, Description, Price, DurationMinutes, IsActive, EmployeeId) VALUES
('ssss3333-3333-3333-3333-333333333333', 'Hair Coloring', 'Full hair coloring service', 100.00, 120, 1, 'eeee1111-1111-1111-1111-111111111111');

INSERT INTO Services (Id, Name, Description, Price, DurationMinutes, IsActive, EmployeeId) VALUES
('ssss4444-4444-4444-4444-444444444444', 'Hair Styling', 'Special occasion hair styling', 40.00, 45, 1, 'eeee2222-2222-2222-2222-222222222222');

INSERT INTO Services (Id, Name, Description, Price, DurationMinutes, IsActive, EmployeeId) VALUES
('ssss5555-5555-5555-5555-555555555555', 'Swedish Massage', 'Relaxing full-body Swedish massage', 80.00, 60, 1, 'eeee3333-3333-3333-3333-333333333333');

INSERT INTO Services (Id, Name, Description, Price, DurationMinutes, IsActive, EmployeeId) VALUES
('ssss6666-6666-6666-6666-666666666666', 'Deep Tissue Massage', 'Therapeutic deep tissue massage', 90.00, 60, 1, 'eeee3333-3333-3333-3333-333333333333');

INSERT INTO Services (Id, Name, Description, Price, DurationMinutes, IsActive, EmployeeId) VALUES
('ssss7777-7777-7777-7777-777777777777', 'Facial Treatment', 'Rejuvenating facial treatment', 70.00, 45, 1, 'eeee4444-4444-4444-4444-444444444444');

INSERT INTO Services (Id, Name, Description, Price, DurationMinutes, IsActive, EmployeeId) VALUES
('ssss8888-8888-8888-8888-888888888888', 'Hot Stone Therapy', 'Relaxing hot stone massage therapy', 120.00, 90, 1, 'eeee3333-3333-3333-3333-333333333333');


-- Scheduled appointment (tomorrow)
INSERT INTO Appointments (Id, CustomerId, AppointmentDateTime, Status, Notes, TotalPrice, CreatedAt) VALUES
('aaaa1111-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', datetime('now', '+1 day', '+10 hours'), 1, 'First time customer', 50.00, datetime('now'));

-- Scheduled appointment (in 2 days)
INSERT INTO Appointments (Id, CustomerId, AppointmentDateTime, Status, Notes, TotalPrice, CreatedAt) VALUES
('aaaa2222-2222-2222-2222-222222222222', 'cccc2222-2222-2222-2222-222222222222', datetime('now', '+2 days', '+14 hours'), 1, 'Prefers light pressure', 80.00, datetime('now'));

-- Completed appointment (2 days ago)
INSERT INTO Appointments (Id, CustomerId, AppointmentDateTime, Status, Notes, TotalPrice, CreatedAt) VALUES
('aaaa3333-3333-3333-3333-333333333333', 'cccc3333-3333-3333-3333-333333333333', datetime('now', '-2 days', '+11 hours'), 3, NULL, 30.00, datetime('now', '-5 days'));

-- Scheduled appointment (in 3 days)
INSERT INTO Appointments (Id, CustomerId, AppointmentDateTime, Status, Notes, TotalPrice, CreatedAt) VALUES
('aaaa4444-4444-4444-4444-444444444444', 'cccc4444-4444-4444-4444-444444444444', datetime('now', '+3 days', '+15 hours'), 1, 'Sensitive skin - use gentle products', 70.00, datetime('now'));

-- Completed appointment (yesterday)
INSERT INTO Appointments (Id, CustomerId, AppointmentDateTime, Status, Notes, TotalPrice, CreatedAt) VALUES
('aaaa5555-5555-5555-5555-555555555555', 'cccc5555-5555-5555-5555-555555555555', datetime('now', '-1 day', '+16 hours'), 3, 'Focus on lower back', 90.00, datetime('now', '-3 days'));

-- Scheduled appointment with multiple services (in 5 days)
INSERT INTO Appointments (Id, CustomerId, AppointmentDateTime, Status, Notes, TotalPrice, CreatedAt) VALUES
('aaaa6666-6666-6666-6666-666666666666', 'cccc1111-1111-1111-1111-111111111111', datetime('now', '+5 days', '+13 hours'), 1, NULL, 190.00, datetime('now'));

-- Cancelled appointment (7 days ago)
INSERT INTO Appointments (Id, CustomerId, AppointmentDateTime, Status, Notes, TotalPrice, CreatedAt) VALUES
('aaaa7777-7777-7777-7777-777777777777', 'cccc2222-2222-2222-2222-222222222222', datetime('now', '-7 days', '+14 hours'), 4, 'Customer cancelled - rescheduled', 80.00, datetime('now', '-10 days'));


INSERT INTO AppointmentServices (Id, AppointmentId, ServiceId, EmployeeId, Price) VALUES
('asas1111-1111-1111-1111-111111111111', 'aaaa1111-1111-1111-1111-111111111111', 'ssss1111-1111-1111-1111-111111111111', 'eeee1111-1111-1111-1111-111111111111', 50.00);

INSERT INTO AppointmentServices (Id, AppointmentId, ServiceId, EmployeeId, Price) VALUES
('asas2222-2222-2222-2222-222222222222', 'aaaa2222-2222-2222-2222-222222222222', 'ssss5555-5555-5555-5555-555555555555', 'eeee3333-3333-3333-3333-333333333333', 80.00);

INSERT INTO AppointmentServices (Id, AppointmentId, ServiceId, EmployeeId, Price) VALUES
('asas3333-3333-3333-3333-333333333333', 'aaaa3333-3333-3333-3333-333333333333', 'ssss2222-2222-2222-2222-222222222222', 'eeee2222-2222-2222-2222-222222222222', 30.00);

INSERT INTO AppointmentServices (Id, AppointmentId, ServiceId, EmployeeId, Price) VALUES
('asas4444-4444-4444-4444-444444444444', 'aaaa4444-4444-4444-4444-444444444444', 'ssss7777-7777-7777-7777-777777777777', 'eeee4444-4444-4444-4444-444444444444', 70.00);

INSERT INTO AppointmentServices (Id, AppointmentId, ServiceId, EmployeeId, Price) VALUES
('asas5555-5555-5555-5555-555555555555', 'aaaa5555-5555-5555-5555-555555555555', 'ssss6666-6666-6666-6666-666666666666', 'eeee3333-3333-3333-3333-333333333333', 90.00);

INSERT INTO AppointmentServices (Id, AppointmentId, ServiceId, EmployeeId, Price) VALUES
('asas6666-6666-6666-6666-666666666666', 'aaaa6666-6666-6666-6666-666666666666', 'ssss8888-8888-8888-8888-888888888888', 'eeee3333-3333-3333-3333-333333333333', 120.00);

INSERT INTO AppointmentServices (Id, AppointmentId, ServiceId, EmployeeId, Price) VALUES
('asas7777-7777-7777-7777-777777777777', 'aaaa6666-6666-6666-6666-666666666666', 'ssss7777-7777-7777-7777-777777777777', 'eeee4444-4444-4444-4444-444444444444', 70.00);

INSERT INTO AppointmentServices (Id, AppointmentId, ServiceId, EmployeeId, Price) VALUES
('asas8888-8888-8888-8888-888888888888', 'aaaa7777-7777-7777-7777-777777777777', 'ssss5555-5555-5555-5555-555555555555', 'eeee3333-3333-3333-3333-333333333333', 80.00);
