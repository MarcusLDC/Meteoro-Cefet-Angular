using MeteoroCefet.Domain.Entities;
using MongoDB.Driver;

namespace MeteoroCefet.Infra
{
    public class EstacaoRepository : MongoRepository<Estacao>
    {
        public EstacaoRepository(IMongoClient mongoClient) : base(mongoClient)
        {
        }

        public async Task AlterarStatus(int numero, Status status)
        {
            var update = Builders<Estacao>.Update.Set(x => x.Status, status);
            await Collection.UpdateOneAsync(e => e.Numero == numero, update);
        }

        public async Task ReplaceEstacao(int numeroEstacao, Estacao estacao)
        {
            await Collection.ReplaceOneAsync(x => x.Numero == numeroEstacao, estacao);
        }
    }
}
