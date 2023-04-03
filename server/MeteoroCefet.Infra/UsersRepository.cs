using MeteoroCefet.Domain.Entities;
using MongoDB.Driver;
using System.ComponentModel;

namespace MeteoroCefet.Infra
{
    public class UsersRepository : MongoRepository<ApplicationUser>
    {
        public UsersRepository(IMongoClient mongoClient) : base(mongoClient)
        {
        }
        public async Task<List<ApplicationUser>> GetAll()
        {
            return await Collection.Find(_ => true).ToListAsync();
        }
        public async Task<ApplicationUser> GetByUsername(string username)
        {
            return await Collection.Find(x => x.Username == username)
                .FirstOrDefaultAsync();
        }
        public async Task RemoveOneByUsername(string username)
        {
            await Collection.DeleteOneAsync(x => x.Username == username);
        }
    }
}
