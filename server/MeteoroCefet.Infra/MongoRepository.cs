using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Domain.Repositories;
using MongoDB.Driver;
using System.Linq.Expressions;

namespace MeteoroCefet.Infra
{
    public abstract class MongoRepository<T> : IRepository<T> where T : Entity
    {
        protected IMongoCollection<T> Collection { get; }

        protected string CollectionName { get; }

        public MongoRepository(IMongoClient mongoClient)
        {
            CollectionName = typeof(T).Name;
            var db = mongoClient.GetDatabase("MeteoroCefetDB");
            Collection = db.GetCollection<T>(CollectionName);
        }

        public async Task<Guid> Add(T entity)
        {
            await Collection.InsertOneAsync(entity);
            return entity.Id;
        }

        public async Task<T> Get(Guid id)
        {
            return await Collection.Find(x => x.Id == id).FirstOrDefaultAsync();
        }

        public async Task<List<T>> Get(Expression<Func<T, bool>> filter)
        {
            return await Collection.Find(filter).ToListAsync();
        }

        public async Task Replace(Guid id, T newEntity)
        {
            await Collection.ReplaceOneAsync(x => x.Id == id, newEntity);
        }

        public async Task<List<T>> GetPaginated(int numPagina, int tamanhoPaginacao) 
        {
            return await Collection.Find(_ => true).Skip((numPagina-1) * tamanhoPaginacao)
                .Limit(tamanhoPaginacao).ToListAsync();
        }
    }
}