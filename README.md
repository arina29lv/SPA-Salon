# Spa Salon Management System

## Tech Stack

### Backend
- **.NET 8** - ASP.NET Core Web API
- **Entity Framework Core** - ORM with Code-First migrations
- **SQLite** - Lightweight database
- **JWT Authentication** - Secure token-based auth with BCrypt password hashing
- **AutoMapper** - Object-to-object mapping
- **FluentValidation** - Server-side validation

### Frontend
- **React 19** - UI library with TypeScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v7** - Client-side routing (SPA)
- **TanStack Query** - Data fetching and caching
- **react-hook-form + Zod** - Form handling and validation
- **i18next** - Internationalization (English + Polish)
- **Lucide React** - Icon library

---

## How to Run the Project

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)

### 1. Database Configuration

#### Option A: Using Entity Framework Migrations (Recommended)

The database will be created automatically on first run with sample data.

```bash
cd Spa-Salon-BackEnd
dotnet ef database update
```

#### Option B: Using SQL Scripts

If you prefer manual database setup:

```bash
cd Spa-Salon-BackEnd/scripts

# Create database schema
sqlite3 ../SpaSalon.db < create-database.sql

# Insert sample data
sqlite3 ../SpaSalon.db < seed-data.sql
```

#### Database Connection

The connection string is configured in `Spa-Salon-BackEnd/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=SpaSalon.db"
  }
}
```

### 2. Run Backend

```bash
cd Spa-Salon-BackEnd
dotnet restore
dotnet run
```

The API will be available at:
- HTTP: http://localhost:5165
- HTTPS: https://localhost:7066
- Swagger UI: http://localhost:5165/swagger

### 3. Run Frontend

```bash
cd Spa-Salon-FrontEnd
npm install
npm run dev
```

The application will be available at: http://localhost:5173

---

## Project Structure

```
Spa-Salon/
├── README.md
│
├── Spa-Salon-BackEnd/                 # .NET 8 Web API
│   ├── Program.cs                     # Application entry point
│   ├── appsettings.json               # Configuration (DB, JWT)
│   ├── SpaSalon.db                    # SQLite database file
│   │
│   ├── Domain/                        # Domain Layer
│   │   ├── Entities/                  # Entity classes
│   │   │   ├── User.cs
│   │   │   ├── Customer.cs
│   │   │   ├── Employee.cs
│   │   │   ├── Service.cs
│   │   │   ├── Appointment.cs
│   │   │   ├── AppointmentService.cs
│   │   │   └── Enums/                 # UserRole, AppointmentStatus
│   │   └── Interfaces/                # Repository interfaces
│   │
│   ├── Application/                   # Application Layer
│   │   ├── DTOs/                      # Data Transfer Objects
│   │   ├── Interfaces/                # Service interfaces
│   │   ├── Services/                  # Business logic
│   │   └── Validators/                # FluentValidation rules
│   │
│   ├── Infrastructure/                # Infrastructure Layer
│   │   ├── Data/
│   │   │   ├── AppDbContext.cs        # EF Core DbContext
│   │   │   └── DbSeeder.cs            # Sample data seeding
│   │   ├── Repositories/              # Repository implementations
│   │   ├── Mappers/                   # AutoMapper profiles
│   │   └── Migrations/                # EF Core migrations
│   │
│   ├── Presentation/                  # Presentation Layer
│   │   ├── Controllers/               # API controllers
│   │   ├── Middleware/                # Exception handling
│   │   └── Extensions/                # DI configuration
│   │
│   └── scripts/                       # SQL scripts
│       ├── create-database.sql        # Schema creation
│       ├── seed-data.sql              # Sample data
│       └── README.md                  # Script usage
│
└── Spa-Salon-FrontEnd/                # React SPA
    ├── package.json                   # Dependencies and scripts
    ├── vite.config.ts                 # Vite configuration
    ├── tailwind.config.js             # Tailwind CSS config
    ├── index.html                     # HTML entry point
    │
    └── src/
        ├── main.tsx                   # React entry point
        ├── App.tsx                    # Routes and providers
        ├── i18n.ts                    # i18next configuration
        │
        ├── api/                       # API client modules
        │   ├── axios.ts               # Axios instance with interceptors
        │   ├── authApi.ts
        │   ├── customerApi.ts
        │   ├── employeeApi.ts
        │   ├── serviceApi.ts
        │   ├── appointmentApi.ts
        │   └── userApi.ts
        │
        ├── components/
        │   ├── common/                # Reusable components
        │   │   ├── Navbar.tsx
        │   │   ├── Footer.tsx
        │   │   ├── Pagination.tsx
        │   │   ├── LoadingSpinner.tsx
        │   │   └── ProtectedRoute.tsx
        │   └── auth/                  # Auth forms
        │       ├── LoginForm.tsx
        │       └── RegisterForm.tsx
        │
        ├── contexts/
        │   └── AuthContext.tsx        # Authentication state
        │
        ├── pages/
        │   ├── HomePage.tsx
        │   ├── customers/             # Customer CRUD pages
        │   ├── employees/             # Employee CRUD pages
        │   ├── services/              # Service CRUD pages
        │   ├── appointments/          # Appointment CRUD pages
        │   └── users/                 # User management pages
        │
        ├── types/                     # TypeScript interfaces
        │
        └── locales/                   # i18n translations
            ├── en.json                # English
            └── pl.json                # Polish
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new customer | Public |
| POST | `/api/auth/login` | Login and get JWT token | Public |
| GET | `/api/auth/me` | Get current user info | Authenticated |

### Users
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | Get all users (paginated) | Admin |
| GET | `/api/users/{id}` | Get user by ID | Admin |
| POST | `/api/users` | Create new user | Admin |
| PUT | `/api/users/{id}` | Update user | Admin |
| DELETE | `/api/users/{id}` | Delete user | Admin |

### Customers
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/customers` | Get all customers (paginated) | Manager, Admin |
| GET | `/api/customers/{id}` | Get customer by ID | Manager, Admin |
| GET | `/api/customers/me` | Get current customer profile | Customer |
| POST | `/api/customers` | Create new customer | Manager, Admin |
| PUT | `/api/customers/{id}` | Update customer | Manager, Admin, Self |
| DELETE | `/api/customers/{id}` | Delete customer | Admin |

### Employees
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/employees` | Get all employees (paginated) | Manager, Admin |
| GET | `/api/employees/list` | Get employee list (no pagination) | Authenticated |
| GET | `/api/employees/{id}` | Get employee by ID | Manager, Admin |
| GET | `/api/employees/me` | Get current employee profile | Employee |
| POST | `/api/employees` | Create new employee | Manager, Admin |
| PUT | `/api/employees/{id}` | Update employee | Manager, Admin |
| DELETE | `/api/employees/{id}` | Delete employee | Admin |

### Services
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/services` | Get all services (paginated) | Public |
| GET | `/api/services/active` | Get active services | Public |
| GET | `/api/services/{id}` | Get service by ID | Public |
| POST | `/api/services` | Create new service | Manager, Admin |
| PUT | `/api/services/{id}` | Update service | Manager, Admin |
| DELETE | `/api/services/{id}` | Delete service | Admin |

### Appointments
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/appointments` | Get appointments (paginated) | Role-based filtering |
| GET | `/api/appointments/{id}` | Get appointment by ID | Owner, Assigned, Admin |
| GET | `/api/appointments/my` | Get current user's appointments | Customer, Employee |
| POST | `/api/appointments` | Create new appointment | Customer, Admin |
| PUT | `/api/appointments/{id}` | Update appointment | Manager, Admin |
| POST | `/api/appointments/{id}/approve` | Approve appointment | Manager, Admin |
| POST | `/api/appointments/{id}/reject` | Reject appointment | Manager, Admin |
| DELETE | `/api/appointments/{id}` | Delete appointment | Admin |

---

## User Roles & Permissions

| Role | Description |
|------|-------------|
| **Guest** (0) | View services, employees; Register |
| **Customer** (1) | Book appointments, view own appointments, manage profile |
| **Employee** (2) | View assigned appointments, manage profile |
| **Manager** (3) | Manage employees, services, appointments; Approve/reject bookings |
| **Admin** (4) | Full access to all resources |

---

## Sample Data

The application seeds the following test accounts:

| Email | Password | Role |
|-------|----------|------|
| admin@spa.com | Admin123! | Admin |
| manager@spa.com | Manager123! | Manager |
| emily@spa.com | Employee123! | Employee |
| james@spa.com | Employee123! | Employee |
| sarah@spa.com | Employee123! | Employee |
| john.smith@email.com | Customer123! | Customer |
| jennifer.white@email.com | Customer123! | Customer |
