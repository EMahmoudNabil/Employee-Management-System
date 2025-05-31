using EmployeeManagementSystem.Core.Interfaces;
using EmployeeManagementSystem.Core.Models;
using EmployeeManagementSystem.DTO;
using Microsoft.AspNetCore.Identity;

namespace EmployeeManagementSystem.Core.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly UserManager<Employee> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public EmployeeService(UserManager<Employee> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task<IEnumerable<Employee>> GetAllAsync()
        {
            return _userManager.Users.ToList();
        }

        public async Task<Employee?> GetByIdAsync(string id)
        {
            return await _userManager.FindByIdAsync(id);
        }

        public async Task AddAsync(Employee employee, string password, string role)
        {
            var result = await _userManager.CreateAsync(employee, password);
            if (!result.Succeeded)
                throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));

            if (!await _roleManager.RoleExistsAsync(role))
                await _roleManager.CreateAsync(new IdentityRole(role));

            await _userManager.AddToRoleAsync(employee, role);
        }

        public async Task UpdateAsync(Employee employee)
        {
            var existing = await _userManager.FindByIdAsync(employee.Id);
            if (existing == null) throw new Exception("Employee not found");

            existing.FirstName = employee.FirstName;
            existing.LastName = employee.LastName;
            existing.NationalId = employee.NationalId;
            existing.Age = employee.Age;
            existing.PhoneNumber = employee.PhoneNumber;
            existing.Signature = employee.Signature;

            await _userManager.UpdateAsync(existing);
        }

        public async Task DeleteAsync(string id)
        {
            var employee = await _userManager.FindByIdAsync(id);
            if (employee != null)
                await _userManager.DeleteAsync(employee);
        }

        public async Task<(IEnumerable<Employee> Employees, int TotalCount)> GetFilteredAsync(EmployeeQueryParameters parameters)
        {
            var query = _userManager.Users.AsQueryable();

            // Filtering
            if (!string.IsNullOrWhiteSpace(parameters.Search))
            {
                query = query.Where(e =>
                    e.FirstName.Contains(parameters.Search) ||
                    e.LastName.Contains(parameters.Search) ||
                    e.NationalId.Contains(parameters.Search));
            }

            // Sorting
            query = parameters.SortBy?.ToLower() switch
            {
                "lastname" => parameters.IsDescending ? query.OrderByDescending(e => e.LastName) : query.OrderBy(e => e.LastName),
                "age" => parameters.IsDescending ? query.OrderByDescending(e => e.Age) : query.OrderBy(e => e.Age),
                _ => parameters.IsDescending ? query.OrderByDescending(e => e.FirstName) : query.OrderBy(e => e.FirstName),
            };

            // Pagination
            var totalCount = await Task.FromResult(query.Count());
            var employees = query
                .Skip((parameters.Page - 1) * parameters.PageSize)
                .Take(parameters.PageSize)
                .ToList();

            return (employees, totalCount);
        }
    }
}
