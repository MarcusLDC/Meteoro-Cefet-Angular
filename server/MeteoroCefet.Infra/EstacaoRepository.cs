using MeteoroCefet.Domain.Entities;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;

namespace MeteoroCefet.Infra
{
    public class EstacaoRepository : MongoRepository<Estacao>
    {
        public EstacaoRepository(IMongoClient mongoClient) : base(mongoClient)
        {
        }
        public async Task ReplaceEstacao(int numeroEstacao, Estacao estacao)
        {
            await Collection.ReplaceOneAsync(x => x.Numero == numeroEstacao, estacao);
        }
    }
}
