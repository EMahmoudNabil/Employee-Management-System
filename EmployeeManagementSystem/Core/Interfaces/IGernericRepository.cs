using System.Linq.Expressions;

namespace EmployeeManagementSystem.Core.Interfaces;

public interface IGenericRepository<T> where T : class
{
    Task<T?> GetByIdAsync(object id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> expression);
    Task AddAsync(T entity);
    void Update(T entity);

    void Remove(T entity);
    Task<bool> ExistsAsync(Expression<Func<T, bool>> expression);
}