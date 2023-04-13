using MeteoroCefet.Application.Models;
using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using System.Globalization;
using CsvHelper;
using MeteoroCefet.Application.Features;
using MediatR;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace MeteoroCefet.API.Endpoints
{
    public class ConsultaTabelaEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("/consulta/tabela", Handler);
        }

        private static async Task<File> Handler(IMediator mediator, [FromBody] ConsultaModel model)
        {
            var stationsAverageData = await mediator.Send(new ConsultaRequest(model));

            var memoryStream = new MemoryStream();
            var writer = new StreamWriter(memoryStream);
            var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);

            WriteHeader(stationsAverageData, csv);
            WriteRecords(stationsAverageData, csv);
            csv.Flush();

            var inicio = model.PeriodoInicio.AddHours(-3).ToString("d", new CultureInfo("pt-BR"));
            var fim = model.PeriodoFim.AddHours(-3).ToString("d", new CultureInfo("pt-BR"));

            var fileName = $"tabela-{inicio}_a_{fim}-{model.Intervalo}.csv";

            return new File(Convert.ToBase64String(memoryStream.ToArray()), "text/csv" , fileName);
        }

        public record File(string Data, string Type, string Name);
        private static void WriteRecords(Dictionary<int, List<ConsultaDTO>> stationsAverageData, CsvWriter csv)
        {
            foreach (var stationAverageData in stationsAverageData)
            {
                foreach (var averageData in stationAverageData.Value)
                {
                    csv.WriteField(averageData.DataHora);
                    csv.WriteField(averageData.Estacao);
                    foreach(var value in averageData.Campos.Values)
                    {
                        csv.WriteField(value);
                    }
                }
                csv.NextRecord();
            }
        }
        private static void WriteHeader(Dictionary<int, List<ConsultaDTO>> stationsAverageData, CsvWriter csv)
        {
            var station = stationsAverageData.Values.First().First();

            csv.WriteField("Data Hora (UTC-3)");
            csv.WriteField("Estacao");
            foreach (var key in station.Campos.Keys)
            {
                csv.WriteField(key);
            }
            csv.NextRecord();
        }
    }
}