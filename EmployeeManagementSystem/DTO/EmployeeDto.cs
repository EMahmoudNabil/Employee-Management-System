namespace EmployeeManagementSystem.DTO
{
    public class CreateEmployeeDto
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string NationalId { get; set; } = null!;
        public int Age { get; set; }
        public string PhoneNumber { get; set; } = null!;
        public string? Signature { get; set; }
    }

    public class UpdateEmployeeDto
    {
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string NationalId { get; set; } = null!;
        public int Age { get; set; }
        public string PhoneNumber { get; set; } = null!;
        public string? Signature { get; set; }
    }
}
