using MeteoroCefet.Domain.Entities;
using MongoDB.Driver;

namespace MeteoroCefet.Infra
{
    public class DadosTempoRepository : MongoRepository<DadosTempo>
    {

        public DadosTempoRepository(IMongoClient mongoClient) : base(mongoClient)
        {
        }
        public async Task<List<DadosTempo>> GetLast(int numPagina, int tamanhoPaginacao)
        {
            return await Collection
                .Find(_ => true)
                .SortByDescending(x => x.DataHora)
                .Skip((numPagina - 1) * tamanhoPaginacao)
                .Limit(tamanhoPaginacao)
                .ToListAsync();
        }
    }
}
