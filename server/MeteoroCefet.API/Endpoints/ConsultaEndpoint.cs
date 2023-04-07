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

namespace MeteoroCefet.API.Endpoints
{
    public class ConsultaEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("/consulta", Handler);
        }

        private static async Task<List<DadosTempo>> Handler([FromServices] DadosTempoRepository repository, [FromBody] ConsultaModel model)
        {

            var query = repository.Collection
                .Find(x => x.DataHora >= model.PeriodoInicio && x.DataHora <= model.PeriodoFim && model.Estacao.Contains(x.Estacao))
                .ToListAsync();

            return await query;
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