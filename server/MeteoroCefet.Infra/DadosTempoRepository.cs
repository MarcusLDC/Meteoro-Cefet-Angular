using MeteoroCefet.Domain.Entities;
using MongoDB.Driver;
using static System.Runtime.InteropServices.JavaScript.JSType;

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
        public async Task<List<DadosTempo>> GetLastEstacao(int numeroEstacao, int numPagina, int tamanhoPaginacao)
        {
            return await Collection
                .Find(x => x.Estacao == numeroEstacao)
                .SortByDescending(x => x.DataHora)
                .Skip((numPagina - 1) * tamanhoPaginacao)
                .Limit(tamanhoPaginacao)
                .ToListAsync();
        }

        public async Task<List<DadosTempo>> GetLastEstacoes(List<int> numeroEstacao, int numPagina, int tamanhoPaginacao)
        {
            return await Collection
                .Find(x => numeroEstacao.Contains(x.Estacao))
                .SortByDescending(x => x.DataHora)
                .Skip((numPagina - 1) * tamanhoPaginacao)
                .Limit(tamanhoPaginacao)
                .ToListAsync();
        }

        public async Task<DateTime> GetStationLastReceivedDate(int numeroEstacao)
        {
            var last =  await Collection
                .Find(x => x.Estacao == numeroEstacao)
                .SortByDescending(x => x.DataHora)
                .FirstAsync();

            return last.DataHora;
        }

        public async Task DeleteOutOfRangeHumidityData()
        {
            var filter = Builders<DadosTempo>.Filter.Or(
                Builders<DadosTempo>.Filter.Lt(x => x.UmidadeRelativaAr, 0),
                Builders<DadosTempo>.Filter.Gt(x => x.UmidadeRelativaAr, 100)
            );

            await Collection.DeleteManyAsync(filter);
        }
    }
}