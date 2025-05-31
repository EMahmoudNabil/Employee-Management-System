using EmployeeManagementSystem.Core.Models;
using EmployeeManagementSystem.DTO;

namespace EmployeeManagementSystem.Core.Interfaces
{
  

        public interface IAttendanceService
        {
            Task<IEnumerable<Attendance>> GetAllAsync();
            Task<Attendance?> GetByIdAsync(int id);
            Task AddAsync(Attendance attendance);
            Task<bool> HasCheckedInTodayAsync(string employeeId);

             Task UpdateAsync(Attendance attendance);


             Task<IEnumerable<Attendance>> GetTodayAttendanceAsync();
            Task<Dictionary<string, TimeSpan>> GetWeeklyWorkingHoursAsync();

            Task<IEnumerable<Attendance>> GetWeeklyAttendanceAsync(string employeeId);
            Task<IEnumerable<DayAttendanceSummaryDTO>> GetWeeklyAttendanceSummaryAsync();

    }



}
