using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace EmployeeManagementSystem.Core.Models;

public class Attendance
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string EmployeeId { get; set; } = null!;

    [Required]
    public DateTime CheckInTime { get; set; }

    public DateTime? CheckOutTime { get; set; }

    public TimeSpan? WorkingHours => CheckOutTime?.Subtract(CheckInTime);

    [ForeignKey(nameof(EmployeeId))]
    public virtual Employee Employee { get; set; } = null!;
} 