using EmployeeManagementSystem.Core.Models;
using EmployeeManagementSystem.DTO;

namespace EmployeeManagementSystem.Core.Interfaces
{


    public interface IEmployeeService
    {
        Task<IEnumerable<Employee>> GetAllAsync();
        Task<Employee?> GetByIdAsync(string id);
        Task AddAsync(Employee employee, string password, string role);
        Task UpdateAsync(Employee employee);
        Task DeleteAsync(string id);

        Task<(IEnumerable<Employee> Employees, int TotalCount)> GetFilteredAsync(EmployeeQueryParameters parameters);

    }

}
