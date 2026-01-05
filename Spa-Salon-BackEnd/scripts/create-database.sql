PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS AppointmentServices;
DROP TABLE IF EXISTS Appointments;
DROP TABLE IF EXISTS Services;
DROP TABLE IF EXISTS Customers;
DROP TABLE IF EXISTS Employees;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    Id TEXT PRIMARY KEY NOT NULL,
    Email TEXT NOT NULL UNIQUE,
    PasswordHash TEXT NOT NULL,
    Role INTEGER NOT NULL DEFAULT 1,
    CreatedAt TEXT NOT NULL
);

CREATE UNIQUE INDEX IX_Users_Email ON Users(Email);

CREATE TABLE Customers (
    Id TEXT PRIMARY KEY NOT NULL,
    FirstName TEXT NOT NULL,
    LastName TEXT NOT NULL,
    Email TEXT NOT NULL,
    Phone TEXT NOT NULL,
    DateOfBirth TEXT,
    UserId TEXT,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX IX_Customers_UserId ON Customers(UserId);

CREATE TABLE Employees (
    Id TEXT PRIMARY KEY NOT NULL,
    FirstName TEXT NOT NULL,
    LastName TEXT NOT NULL,
    Email TEXT NOT NULL,
    Phone TEXT NOT NULL,
    Position TEXT NOT NULL,
    HireDate TEXT NOT NULL,
    UserId TEXT,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX IX_Employees_UserId ON Employees(UserId);

CREATE TABLE Services (
    Id TEXT PRIMARY KEY NOT NULL,
    Name TEXT NOT NULL,
    Description TEXT NOT NULL,
    Price REAL NOT NULL,
    DurationMinutes INTEGER NOT NULL,
    IsActive INTEGER NOT NULL DEFAULT 1,
    EmployeeId TEXT NOT NULL,
    FOREIGN KEY (EmployeeId) REFERENCES Employees(Id) ON DELETE RESTRICT
);

CREATE INDEX IX_Services_EmployeeId ON Services(EmployeeId);

CREATE TABLE Appointments (
    Id TEXT PRIMARY KEY NOT NULL,
    CustomerId TEXT NOT NULL,
    AppointmentDateTime TEXT NOT NULL,
    Status INTEGER NOT NULL DEFAULT 0,
    Notes TEXT,
    TotalPrice REAL NOT NULL,
    CreatedAt TEXT NOT NULL,
    FOREIGN KEY (CustomerId) REFERENCES Customers(Id) ON DELETE CASCADE
);

CREATE INDEX IX_Appointments_CustomerId ON Appointments(CustomerId);

CREATE TABLE AppointmentServices (
    Id TEXT PRIMARY KEY NOT NULL,
    AppointmentId TEXT NOT NULL,
    ServiceId TEXT NOT NULL,
    EmployeeId TEXT NOT NULL,
    Price REAL NOT NULL,
    FOREIGN KEY (AppointmentId) REFERENCES Appointments(Id) ON DELETE CASCADE,
    FOREIGN KEY (ServiceId) REFERENCES Services(Id) ON DELETE RESTRICT,
    FOREIGN KEY (EmployeeId) REFERENCES Employees(Id) ON DELETE RESTRICT
);

CREATE INDEX IX_AppointmentServices_AppointmentId ON AppointmentServices(AppointmentId);
CREATE INDEX IX_AppointmentServices_ServiceId ON AppointmentServices(ServiceId);
CREATE INDEX IX_AppointmentServices_EmployeeId ON AppointmentServices(EmployeeId);
