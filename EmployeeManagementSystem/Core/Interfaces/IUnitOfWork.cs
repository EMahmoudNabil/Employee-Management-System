namespace EmployeeManagementSystem.Core.Interfaces;

// this interface is used to define the contract for the UnitOfWork pattern
public interface IUnitOfWork : IDisposable
{
    IGenericRepository<TEntity> Repository<TEntity>() where TEntity : class;
    Task<int> CompleteAsync();
}


