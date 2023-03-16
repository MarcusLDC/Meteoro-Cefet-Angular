using System.Linq.Expressions;

namespace MeteoroCefet.Domain.Repositories
{
    public interface IRepository<T>
    {
        public Task<Guid> Add(T entity);
        public Task<T> Get(Guid id);
        public Task<List<T>> Get(Expression<Func<T, bool>> filter);
        public Task Replace(Guid id, T newEntity);
    }
}
