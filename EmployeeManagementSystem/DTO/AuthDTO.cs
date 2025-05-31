namespace EmployeeManagementSystem.DTO
{
    // ✅ DTOs
    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class RegisterDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string NationalId { get; set; }
        public int Age { get; set; }
        public string PhoneNumber { get; set; }
        public string? Signature { get; set; }
        public string Role { get; set; } // Admin or Employee
    }
}

