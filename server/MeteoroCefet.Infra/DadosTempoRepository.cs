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

        public async Task<DateTime> GetStationLastReceivedDate(int numeroEstacao)
        {
            var last =  await Collection
                .Find(x => x.Estacao == numeroEstacao)
                .SortByDescending(x => x.DataHora)
                .FirstAsync();

            return last.DataHora;
        }
        public async Task<List<DadosTempo>> GetLastDayByEstacao(int numPagina, int numEstacao) // falta fazer direitinho ainda
        {
            var query = await Collection
                .Find(x => x.DataHora >= DateTime.UtcNow.AddDays(-numPagina) && x.Estacao == numEstacao)
                .SortByDescending(x => x.DataHora)
                .ToListAsync();

            var grouped = query
                .GroupBy(x => new DateTime(x.DataHora.Year, x.DataHora.Month, x.DataHora.Day, x.DataHora.Hour, x.DataHora.Minute / 30 * 30, 0).AddHours(-3))
                .ToList();

            var result = grouped
                .SelectMany(x => x)
                .ToList();

            return result;
        }
    }
}
