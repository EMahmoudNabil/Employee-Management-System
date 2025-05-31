using EmployeeManagementSystem.Core.Interfaces;
using EmployeeManagementSystem.Infrastructure.Data;
using EmployeeManagementSystem.Infrastructure.Repositories;

namespace EmployeeManagementSystem.Infrastructure.UnitOfWork;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _applicationDbContext; 
    private readonly Dictionary<Type, object> _repositoryDictionary;

    public UnitOfWork(ApplicationDbContext context)
    {
        _applicationDbContext = context;
        _repositoryDictionary = new Dictionary<Type, object>();
    }

    public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : class
    {
        var type = typeof(TEntity);

        if (!_repositoryDictionary.ContainsKey(type))
        {
            var repositoryType = typeof(GenericRepository<>);
            var repositoryInstance = Activator.CreateInstance(repositoryType.MakeGenericType(typeof(TEntity)), _applicationDbContext);
            _repositoryDictionary.Add(type, repositoryInstance!);
        }

        return (IGenericRepository<TEntity>)_repositoryDictionary[type];
    }

    public async Task<int> CompleteAsync()
    {
        return await _applicationDbContext.SaveChangesAsync();
    }

    public void Dispose()
    {
        _applicationDbContext.Dispose();
    }
}
