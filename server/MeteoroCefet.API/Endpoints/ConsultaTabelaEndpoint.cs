using MeteoroCefet.Application.Models;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using CsvHelper;
using MeteoroCefet.Application.Features;
using MediatR;

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
            var data = await mediator.Send(new ConsultaRequest(model));

            var memoryStream = new MemoryStream();
            var writer = new StreamWriter(memoryStream);
            var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);

            WriteHeader(data, csv);
            WriteRecords(data, csv);
            csv.Flush();

            var inicio = model.PeriodoInicio.AddHours(-3).ToString("d", new CultureInfo("pt-BR"));
            var fim = model.PeriodoFim.AddHours(-3).ToString("d", new CultureInfo("pt-BR"));

            var fileName = $"tabela-{inicio}_a_{fim}-{model.Intervalo}.csv";

            return new File(Convert.ToBase64String(memoryStream.ToArray()), "text/csv", fileName);
        }
        public record File(string Data, string Type, string Name);
        private static void WriteRecords(ConsultaDTO consultaData, CsvWriter csv)
        {
            foreach (var stationData in consultaData.StationsData)
            {
                foreach (var data in stationData.Statistics)
                {
                    csv.WriteField(data.Date);
                    csv.WriteField(stationData.Station);

                    foreach (var point in data.Points)
                    {
                        csv.WriteField(point);
                    }
                    csv.NextRecord();
                }
            }
        }
        private static void WriteHeader(ConsultaDTO data, CsvWriter csv)
        {
            csv.WriteField("Data Hora (UTC-3)");
            csv.WriteField("Estacao");

            foreach (var key in data.SelectedFields)
            {
                csv.WriteField(key);
            }

            csv.NextRecord();
        }
    }
}