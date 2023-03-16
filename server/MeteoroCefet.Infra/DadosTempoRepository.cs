using MeteoroCefet.Domain.Entities;
using MongoDB.Driver;

namespace MeteoroCefet.Infra
{
    public class DadosTempoRepository : MongoRepository<DadosTempo>
    {
        public DadosTempoRepository(IMongoClient mongoClient) : base(mongoClient)
        {
        }
    }
}
