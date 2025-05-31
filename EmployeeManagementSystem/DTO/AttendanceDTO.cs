namespace EmployeeManagementSystem.DTO
{

    public class AttendanceDTO
    {
        public int Id { get; set; }
        public string EmployeeId { get; set; } = null!;
        public DateTime CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }
        public TimeSpan? WorkingHours { get; set; }
    }

}
