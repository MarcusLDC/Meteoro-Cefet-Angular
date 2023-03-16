using MeteoroCefet.Domain.Entities;
using MongoDB.Driver;

namespace MeteoroCefet.Infra
{
    public class EstacaoRepository : MongoRepository<Estacao>
    {
        public EstacaoRepository(IMongoClient mongoClient) : base(mongoClient)
        {
        }
    }
}
