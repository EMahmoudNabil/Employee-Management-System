# Employee Management System

A modern, full-stack web application for managing employee data, attendance, and daily operations with role-based access control.



## 📋 Project Description

The Employee Management System is a comprehensive solution designed to streamline HR operations and employee management. It provides a secure, user-friendly interface for both administrators and employees to manage their daily tasks and information.

### Project Demo
🚀  Project Demo (https://youtu.be/AIalfqIH-3M)

### Key Features

- 🔐 **Secure Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin & Employee roles)
  - Secure password hashing and token management

- 👥 **Employee Management**
  - Complete CRUD operations for employee profiles
  - Employee information management
  - Profile updates and maintenance

- ⏰ **Attendance System**
  - Daily check-in functionality
  - Time-restricted attendance tracking
  - Attendance history and reports

- ✍️ **Digital Signature**
  - Signature upload and management
  - Document signing capabilities
  - Signature verification

- 🎨 **Modern UI/UX**
  - Responsive design for all devices
  - Clean and intuitive interface
  - Real-time updates and notifications

## 🛠️ Tech Stack

### Backend
- ASP.NET Core 9.0 Web API
- Entity Framework Core
- SQL Server
- JWT Authentication
- Swagger/OpenAPI

### Frontend
- Angular 17
- TypeScript
- Angular Material
- RxJS
- NgRx (State Management)
- SCSS

### Development Tools
- Visual Studio 2022
- Visual Studio Code
- Git
- SQL Server Management Studio

## 🚀 Getting Started

### Prerequisites
- .NET 9.0 SDK
- Node.js (v18 or later)
- Angular CLI
- SQL Server
- Visual Studio 2022 or VS Code

### Backend Setup

1. Clone the repository
```bash
git https://github.com/EMahmoudNabil/Employee-Management-System
```

2. Navigate to the backend directory
```bash
cd EmployeeManagementSystem.API
```

3. Install dependencies
```bash
dotnet restore
```

4. Update the connection string in `appsettings.json`

5. Run database migrations
```bash
dotnet ef database update
```

6. Start the API
```bash
dotnet run
```

The API will be available at `https://localhost:7001`

### Frontend Setup

1. Navigate to the frontend directory
```bash
cd EmployeeManagementSystem.Web
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
ng serve
```

The application will be available at `http://localhost:4200`

## 📊 Database Schema

### Users
- Id (PK)
- Username
- Email
- PasswordHash
- RoleId (FK)
- CreatedAt
- UpdatedAt

### Roles
- Id (PK)
- Name
- Description

### Employees
- Id (PK)
- UserId (FK)
- FirstName
- LastName
-	Phone Number 
-	National ID 
-	Age 
-	Signature  


### Attendance
- Id (PK)
- EmployeeId (FK)
- CheckInTime
- CheckOutTime
- Date


## 👮‍♂️ Roles and Permissions

### Admin Role
- Manage all employee records
- View and generate reports
- Manage user roles and permissions
- Access system settings
- View attendance records
- Manage departments and positions

### Employee Role
- View and update personal information
- Record daily attendance
- Upload and manage signature
- View personal attendance history
- Access basic employee information

## 📸 Screenshots
### Architecture Backend
![Structure Backend](image.png)

### Architecture FrontEnd 
![Structure FrontEnd ](image-1.png)

### EndPoint 
![EndPoint](image-2.png)
### Login Page
![Login Page](image-3.png)

### Dashboard
![Dashboard](image-4.png)

### Employee Management
![Employee Management](image-5.png)
###  Profile Employee Management
![Profile Employee Management](image-6.png)
###  Check in and check out For Employee
![Check in and check out For Employee](image-7.png)

## 👨‍💻 Author

**Mahmoud Nabil**
- LinkedIn: https://www.linkedin.com/in/emahmoudnabil/
- Email: e.mahmoudnabil@gmail.com
- GitHub: https://github.com/EMahmoudNabil

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

 
