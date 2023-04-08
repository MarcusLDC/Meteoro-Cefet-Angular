using MeteoroCefet.Application.Models;
using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;
using CsvHelper;
using CsvHelper.Configuration;
using System.Globalization;
using System.IO;
using System.Text;
using MongoDB.Driver;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using MongoDB.Driver.Linq;
using System.Runtime.InteropServices;
using System.Runtime.CompilerServices;

namespace MeteoroCefet.API.Endpoints
{
    public class ConsultaEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("/consulta", Handler);
        }

        private static async Task<List<ConsultaResultModel>> Handler([FromServices] DadosTempoRepository repository, [FromBody] ConsultaModel model)
        {
            // 1 minuto, 10 minutos, 30 minutos, 1 hora, 24 horas, mensal

            model.PeriodoFim = model.PeriodoFim.AddHours(23).AddMinutes(59);

            var query = repository.Collection
                .Find(x => x.DataHora >= model.PeriodoInicio && x.DataHora <= model.PeriodoFim && model.Estacao.Contains(x.Estacao))
                .SortBy(x => x.Estacao)
                .ToListAsync();

            var result = await query;

            var groupedIntervalo = result.GroupBy(x => new {
                            Estacao = x.Estacao,
                            DataHora = new DateTime(x.DataHora.Year, x.DataHora.Month, x.DataHora.Day, x.DataHora.Hour, x.DataHora.Minute / 10 * 10, 0)
                         })
                        .Select(g => new ConsultaResultModel 
                        {
                            DataHora = g.Key.DataHora,
                            Estacao = g.Average(x => x.Estacao),
                            TempAr = g.Average(x => x.TemperaturaAr),     // Falta > Implementar filtro para todos os intervalos
                            TempMin = g.Average(x => x.TemperaturaAr),      // > Produzir o CSV e o grafico no backend
                            TempMax = g.Average(x => x.TemperaturaAr),      // > Filtro para ignorar campos
                            TempOrv = g.Average(x => x.TempPontoOrvalho),   // > Calcular a TempMax, TempMin e VelocidadeMax do vento
                            Chuva = g.Average(x => x.Precipitacao),         // > Formatar a DataHora e limitar os decimais dos doubles.
                            DirecaoVento = g.Average(x => x.DirecaoVento),
                            VelocidadeVento = g.Average(x => x.VelocidadeVento),
                            VelocidadeVentoMax = g.Average(x => x.VelocidadeVento),
                            Bateria = g.Average(x => x.Bateria),
                            Radiacao = g.Average(x => x.RadSolar),
                            PressaoATM = g.Average(x => x.Pressao),
                            IndiceCalor = g.Average(x => x.IndiceCalor),
                            UmidadeRelativa = g.Average(x => x.Extra2),
                        })
                        .ToList();

            return groupedIntervalo;
        }
    }
}

/* var memoryStream = new MemoryStream();
var streamWriter = new StreamWriter(memoryStream, Encoding.UTF8);

await streamWriter.WriteLineAsync("DataHora, Estacao");

foreach (var registro in query)
{
    await streamWriter.WriteLineAsync($"{registro.DataHora},{registro.Estacao}");
}

await streamWriter.FlushAsync();
memoryStream.Position = 0;
return new FileStreamResult(memoryStream, "text/csv")
{
    FileDownloadName = "dados.csv"
};

*/