using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace EmployeeManagementSystem.Core.Models;

public class Employee : IdentityUser
{
    [Required]
    [StringLength(50)]
    public string FirstName { get; set; } = null!;

    [Required]
    [StringLength(50)]
    public string LastName { get; set; } = null!;

    [Required]
    [StringLength(14)]
    public string NationalId { get; set; } = null!;

    [Required]
    public int Age { get; set; }

    public string? Signature { get; set; }

    public virtual ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
}