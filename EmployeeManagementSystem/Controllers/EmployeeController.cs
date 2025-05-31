using EmployeeManagementSystem.Core.Interfaces;
using EmployeeManagementSystem.Core.Models;
using EmployeeManagementSystem.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
  
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeeController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var employees = await _employeeService.GetAllAsync();
            return Ok(employees);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var employee = await _employeeService.GetByIdAsync(id);
            if (employee == null) return NotFound();
            return Ok(employee);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreateEmployeeDto dto)
        {
            var employee = new Employee
            {
                UserName = dto.Email,
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                NationalId = dto.NationalId,
                Age = dto.Age,
                PhoneNumber = dto.PhoneNumber,
                Signature = dto.Signature
            };

            await _employeeService.AddAsync(employee, dto.Password, "Employee");
            return Ok("Employee created successfully.");
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateEmployeeDto dto)
        {
            var employee = new Employee
            {
                Id = id,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                NationalId = dto.NationalId,
                Age = dto.Age,
                PhoneNumber = dto.PhoneNumber,
                Signature = dto.Signature
            };

            await _employeeService.UpdateAsync(employee);
            return Ok("Employee updated successfully.");
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(string id)
        {
            await _employeeService.DeleteAsync(id);
            return Ok("Employee deleted successfully.");
        }

        [HttpGet("paged")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetPaged([FromQuery] EmployeeQueryParameters parameters)
        {
            var (employees, totalCount) = await _employeeService.GetFilteredAsync(parameters);
            return Ok(new
            {
                totalCount,
                data = employees
            });
        }
    }

   
}
