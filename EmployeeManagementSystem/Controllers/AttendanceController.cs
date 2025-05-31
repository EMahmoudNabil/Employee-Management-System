using EmployeeManagementSystem.Core.Interfaces;
using EmployeeManagementSystem.Core.Models;
using EmployeeManagementSystem.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EmployeeManagementSystem.Controllers
{

    [ApiController]
    [Route("api/[controller]")]

    public class AttendanceController : ControllerBase
    {
        private readonly IAttendanceService _attendanceService;

        public AttendanceController(IAttendanceService attendanceService)
        {
            _attendanceService = attendanceService;
        }
        [Authorize(Roles = "Employee")]
        [HttpPost("check-in")]
        public async Task<IActionResult> CheckIn()
        {
            var employeeId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (await _attendanceService.HasCheckedInTodayAsync(employeeId))
                return BadRequest("You have already checked in today.");

            var now = DateTime.Now;
            var start = DateTime.Today.AddHours(7.5); // 7:30 AM
            var end = DateTime.Today.AddHours(9);     // 9:00 AM

            if (now < start || now > end)
                return BadRequest("Check-in is allowed only between 7:30 AM and 9:00 AM.");

            var attendance = new Attendance
            {
                EmployeeId = employeeId,
                CheckInTime = now
            };

            await _attendanceService.AddAsync(attendance);
            return Ok("Check-in successful.");
        }
       
        [Authorize(Roles = "Employee")]
        [HttpPost("check-out")]
        public async Task<IActionResult> CheckOut()
        {
            var employeeId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var today = DateTime.Today;

            var attendance = (await _attendanceService.GetAllAsync())
                .FirstOrDefault(a => a.EmployeeId == employeeId && a.CheckInTime.Date == today);

            if (attendance == null)
                return BadRequest("You must check in before checking out.");

            if (attendance.CheckOutTime != null)
                return BadRequest("You have already checked out today.");

            var now = DateTime.Now;
            var latestAllowedCheckout = DateTime.Today.AddHours(24); // 6:00 PM  18

            if (now > latestAllowedCheckout)
                return BadRequest("Check-out is not allowed after 6:00 PM.");

            attendance.CheckOutTime = now;

            await _attendanceService.UpdateAsync(attendance);

            return Ok("Check-out successful.");
        }


        [Authorize(Roles = "Employee")]
        [HttpGet("history")]
        public async Task<IActionResult> GetHistory()
        {
            var employeeId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var history = await _attendanceService.GetAllAsync();
            var personalHistory = history
                .Where(a => a.EmployeeId == employeeId)
                .Select(a => new AttendanceDTO
                {
                    Id = a.Id,
                    EmployeeId = a.EmployeeId,
                    CheckInTime = a.CheckInTime,
                    CheckOutTime = a.CheckOutTime,
                    WorkingHours = a.WorkingHours
                });

            return Ok(personalHistory);
        }


        [Authorize(Roles = "Admin")]
        [HttpGet("today")]
        public async Task<IActionResult> GetTodayAttendance()
        {
            var result = await _attendanceService.GetTodayAttendanceAsync();
            var dtoList = result.Select(a => new AttendanceDTO
            {
                Id = a.Id,
                EmployeeId = a.EmployeeId,
                CheckInTime = a.CheckInTime,
                CheckOutTime = a.CheckOutTime,
                WorkingHours = a.WorkingHours
            });

            return Ok(dtoList);
        }


        [Authorize(Roles = "Admin")]
        [HttpGet("weekly-summary")]
        public async Task<IActionResult> GetWeeklyWorkingHours()
        {
            var result = await _attendanceService.GetWeeklyWorkingHoursAsync();
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("weekly-attendance-summary")]
        public async Task<IActionResult> GetWeeklyAttendanceSummary()
        {
            var summary = await _attendanceService.GetWeeklyAttendanceSummaryAsync();
            return Ok(summary);
        }

    }

}
