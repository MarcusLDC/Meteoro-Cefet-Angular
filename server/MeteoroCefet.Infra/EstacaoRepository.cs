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
        public async Task ReplaceSenha(int numero, string senha)
        {
            var update = Builders<Estacao>.Update.Set(x => x.Senha, senha);
            await Collection.UpdateOneAsync(y => y.Numero == numero, update);
        }
        public async Task<bool> DeleteStation(int numero)
        {
            var estacao = await Collection.Find(x => x.Numero == numero).FirstOrDefaultAsync();

            return true;
        }
    }
}
