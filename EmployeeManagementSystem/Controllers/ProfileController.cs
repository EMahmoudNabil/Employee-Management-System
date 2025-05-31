using EmployeeManagementSystem.Core.Interfaces;
using EmployeeManagementSystem.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EmployeeManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Employee")]
    public class ProfileController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;
        private readonly IAttendanceService _attendanceService;

        public ProfileController(IEmployeeService employeeService, IAttendanceService attendanceService)
        {
            _employeeService = employeeService;
            _attendanceService = attendanceService;
        }

        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            var employeeId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var employee = await _employeeService.GetByIdAsync(employeeId);
            if (employee == null) return NotFound("Employee not found");

            var attendance = await _attendanceService.GetWeeklyAttendanceAsync(employeeId);

            return Ok(new
            {
                Profile = new
                {
                    employee.FirstName,
                    employee.LastName,
                    employee.Email,
                    employee.PhoneNumber,
                    employee.NationalId,
                    employee.Age,
                    employee.Signature
                },
                WeeklyAttendance = attendance.Select(a => new
                {
                    a.CheckInTime,
                    a.CheckOutTime,
                    WorkingHours = a.WorkingHours?.ToString(@"hh\:mm") ?? "N/A"
                })
            });
        }

        [HttpPost("upload-signature")]
        public async Task<IActionResult> UploadSignature([FromBody] SignatureDto model)
        {
            var employeeId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var employee = await _employeeService.GetByIdAsync(employeeId);
            if (employee == null) return NotFound("Employee not found");

            if (!string.IsNullOrEmpty(employee.Signature))
                return BadRequest("Signature already exists. Contact admin to update.");

            employee.Signature = model.SignatureData;
            await _employeeService.UpdateAsync(employee);

            return Ok("Signature uploaded successfully.");
        }
    }
}
