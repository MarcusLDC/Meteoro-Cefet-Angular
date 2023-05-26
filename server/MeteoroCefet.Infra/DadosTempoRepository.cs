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
        public async Task<List<DadosTempo>> GetLastDayByEstacao(int numPagina, int numEstacao) // falta fazer direitinho ainda
        {

            var diaUTC = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day).AddHours(3); 

            var query = await Collection
                .Find(x => x.DataHora >= diaUTC.AddDays(-numPagina + 1) && x.DataHora < diaUTC.AddDays(-numPagina + 2) && x.Estacao == numEstacao)
                .SortByDescending(x => x.DataHora)
                .ToListAsync();

            var grouped = query
                .GroupBy(x => new DateTime(x.DataHora.Year, x.DataHora.Month, x.DataHora.Day, x.DataHora.Hour, x.DataHora.Minute / 30 * 30, 0))
                .ToList();

            var result = grouped
                .Select(x => new DadosTempo 
                    { DataHora = x.Key.AddHours(-3),
                      Estacao = x.First().Estacao,
                      TemperaturaAr = Round(x.Average(x => x.TemperaturaAr)),
                      UmidadeRelativaAr = Round(x.Average(x => x.UmidadeRelativaAr)),
                      Pressao = Round(x.Average(x => x.Pressao)),
                      RadSolar  = Round(x.Average(x => x.RadSolar)),
                      Precipitacao = Round(x.Sum(x => x.Precipitacao)),
                      DirecaoVento = Round(x.Average(x => x.DirecaoVento)),
                      VelocidadeVento = Round(x.Average(x => x.VelocidadeVento)),
                      TempPontoOrvalho = Round(x.Average(x => x.TempPontoOrvalho)),
                      IndiceCalor = Round(x.Average(x => x.IndiceCalor)),
                      DeficitPressaoVapor = Round(x.Average(x => x.DeficitPressaoVapor)),
                      Bateria = Round(x.Average(x => x.Bateria)),
                      Extra1 = Round(x.Average(x => x.Extra1)),
                      Extra2 = Round(x.Average(x => x.Extra2)),
                      Extra3 = Round(x.Average(x => x.Extra3)),
                      Extra4 = Round(x.Average(x => x.Extra4)),
                      Status = x.Last().Status
                    })
                .ToList();

            return result;
        }
        private static double Round(double num)
        {
            return Math.Round(num, 2);
        }
    }
}