using EmployeeManagementSystem.Core.Interfaces;
using EmployeeManagementSystem.Core.Models;
using EmployeeManagementSystem.DTO;

namespace EmployeeManagementSystem.Core.Services
{

    public class AttendanceService : IAttendanceService
    {
        private readonly IUnitOfWork _unitOfWork;

        public AttendanceService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Attendance>> GetAllAsync()
        {
            return await _unitOfWork.Repository<Attendance>().GetAllAsync();
        }

        public async Task<Attendance?> GetByIdAsync(int id)
        {
            return await _unitOfWork.Repository<Attendance>().GetByIdAsync(id);
        }

        public async Task AddAsync(Attendance attendance)
        {
            await _unitOfWork.Repository<Attendance>().AddAsync(attendance);
            await _unitOfWork.CompleteAsync();
        }

        public async Task<bool> HasCheckedInTodayAsync(string employeeId)
        {
            var today = DateTime.Today;
            return await _unitOfWork.Repository<Attendance>().ExistsAsync(a =>
            a.EmployeeId == employeeId &&
            a.CheckInTime.Date == today);
        }

        public async Task<IEnumerable<Attendance>> GetTodayAttendanceAsync()
        {
            var today = DateTime.Today;
            return await _unitOfWork.Repository<Attendance>().FindAsync(a => a.CheckInTime.Date == today);
        }

        public async Task<Dictionary<string, TimeSpan>> GetWeeklyWorkingHoursAsync()
        {
            var startOfWeek = DateTime.Today.AddDays(-(int)DateTime.Today.DayOfWeek + 1); // Monday
            var endOfWeek = startOfWeek.AddDays(7);

            var attendances = await _unitOfWork.Repository<Attendance>().FindAsync(a =>
                a.CheckInTime >= startOfWeek && a.CheckInTime < endOfWeek && a.CheckOutTime != null);

            return attendances
                .GroupBy(a => a.EmployeeId)
                .ToDictionary(
                    g => g.Key,
                    g => TimeSpan.FromMinutes(g.Sum(a => a.WorkingHours?.TotalMinutes ?? 0))
                );
        }

        public async Task<IEnumerable<Attendance>> GetWeeklyAttendanceAsync(string employeeId)
        {
            var startOfWeek = DateTime.Today.AddDays(-(int)DateTime.Today.DayOfWeek + 1); // Monday
            var endOfWeek = startOfWeek.AddDays(7);

            return await _unitOfWork.Repository<Attendance>().FindAsync(a =>
                a.EmployeeId == employeeId &&
                a.CheckInTime >= startOfWeek &&
                a.CheckInTime < endOfWeek);
        }


        public async Task UpdateAsync(Attendance attendance)
        {
            _unitOfWork.Repository<Attendance>().Update(attendance);
            await _unitOfWork.CompleteAsync();
        }
        public async Task<IEnumerable<DayAttendanceSummaryDTO>> GetWeeklyAttendanceSummaryAsync()
        {
            var startOfWeek = DateTime.Today.AddDays(-(int)DateTime.Today.DayOfWeek + 1); // Monday
            var endOfWeek = startOfWeek.AddDays(7);

            var attendances = await _unitOfWork.Repository<Attendance>().FindAsync(a =>
                a.CheckInTime >= startOfWeek && a.CheckInTime < endOfWeek);

            var grouped = attendances
                .GroupBy(a => a.CheckInTime.DayOfWeek)
                .Select(g => new DayAttendanceSummaryDTO
                {
                    Day = g.Key.ToString().Substring(0, 3), // e.g., "Mon"
                    Count = g.Count()
                })
                .OrderBy(d => GetDayOrder(d.Day)) // Ensure correct order
                .ToList();

            return grouped;
        }

        private int GetDayOrder(string day)
        {
            return day switch
            {
                "Mon" => 1,
                "Tue" => 2,
                "Wed" => 3,
                "Thu" => 4,
                "Fri" => 5,
                "Sat" => 6,
                "Sun" => 7,
                _ => 8
            };
        }




    }

}
