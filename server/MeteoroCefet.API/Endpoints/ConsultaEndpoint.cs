using Amazon.Runtime.Internal.Transform;
using MeteoroCefet.Application.Models;
using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using CsvHelper;
using CsvHelper.Configuration;
using DnsClient.Protocol;
using System.Text;

namespace MeteoroCefet.API.Endpoints
{
    public class ConsultaEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("/consulta", Handler);
        }

        private static async Task<File> Handler([FromServices] DadosTempoRepository repository, [FromBody] ConsultaModel model)
        {
            IEnumerable<Dictionary<string, object?>> stationsAverageData = await GetConsultaData(repository, model);

            var memoryStream = new MemoryStream();
            var writer = new StreamWriter(memoryStream);
            var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);

            WriteHeader(stationsAverageData, csv);
            WriteRecords(stationsAverageData, csv);
            csv.Flush();

            var inicio = model.PeriodoInicio.AddHours(-3).ToString("d", new CultureInfo("pt-BR"));
            var fim = model.PeriodoFim.AddHours(-3).ToString("d", new CultureInfo("pt-BR"));

            var fileName = "dados-" + inicio + "_a_" + fim + "-" + model.Intervalo + ".csv";

            return new File(Convert.ToBase64String(memoryStream.ToArray()), "text/csv" , fileName);
        }

        public record File(string Data, string Type, string Name);

        private static async Task<IEnumerable<Dictionary<string, object?>>> GetConsultaData(DadosTempoRepository repository, ConsultaModel model)
        {
            model.PeriodoFim = model.PeriodoFim.AddHours(23).AddMinutes(59);

            var result = await repository.Collection
                .Find(x => x.DataHora >= model.PeriodoInicio && x.DataHora <= model.PeriodoFim && model.Estacao.Contains(x.Estacao))
                .SortBy(x => x.Estacao)
                .ToListAsync();

            foreach(var data in result)
            {
                data.DataHora = data.DataHora.AddHours(-3);
            }

            var groupedByIntervalo = result.GroupBy(x => new
            {
                x.Estacao,
                DataHora = GetIntervaloDataHora(x.DataHora, model.Intervalo)
            });

            var stationsAverageData = groupedByIntervalo.Select(g => new Dictionary<string, object?>
                {
                    { "Data Hora (UTC-3)" , g.Key.DataHora.ToString("g", new CultureInfo("pt-BR"))},
                    { "Estacao" , g.Key.Estacao },

                    { "Temp. Ar" , model.TempAr ? Math.Round(g.Average(x => x.TemperaturaAr), 2) : null},
                    { "Temp. Min" , model.TempMin ? Math.Round(g.Min(x => x.TemperaturaAr), 2) : null},
                    { "Temp. Max" , model.TempMax ? Math.Round(g.Max(x => x.TemperaturaAr), 2) : null},
                    { "Temp. Orv" , model.TempOrv ? Math.Round(g.Average(x => x.TempPontoOrvalho), 2) : null},

                    { "Chuva" , model.Chuva ? Math.Round(g.Average(x => x.Precipitacao), 2) : null},
                    { "Direcao Vento" , model.DirecaoVento ? Math.Round(g.Average(x => x.DirecaoVento), 2) : null},
                    { "VelocidadeVento" , model.VelocidadeVento ? Math.Round(g.Average(x => x.VelocidadeVento), 2) : null},
                    { "VelocidadeVentoMax" , model.VelocidadeVentoMax ? g.Max(x => x.VelocidadeVento) : null},

                    { "Bateria" , model.Bateria ? Math.Round(g.Average(x => x.Bateria), 2) : null},
                    { "Radiacao" , model.Radiacao ? Math.Round(g.Average(x => x.RadSolar), 2) : null},
                    { "Pressao ATM" , model.PressaoATM ? Math.Round(g.Average(x => x.Pressao), 2) : null},
                    { "Indice Calor" , model.IndiceCalor ? Math.Round(g.Average(x => x.IndiceCalor), 2) : null},
                    { "Umidade Relativa" , model.UmidadeRelativa ?  Math.Round(g.Average(x => x.Extra2), 2) : null}
                })
                .Select(x => x.Where(y => y.Value != null)
                .ToDictionary(x => x.Key, x => x.Value));

            return stationsAverageData;
        }

        private static void WriteRecords(IEnumerable<Dictionary<string, object?>> stationsAverageData, CsvWriter csv)
        {
            foreach (var stationAverageData in stationsAverageData)
            {
                foreach (var averageData in stationAverageData)
                {
                    csv.WriteField(averageData.Value);
                }
                csv.NextRecord();
            }
        }

        private static void WriteHeader(IEnumerable<Dictionary<string, object?>> stationsAverageData, CsvWriter csv)
        {
            foreach (var key in stationsAverageData.First().Keys)
            {
                csv.WriteField(key);
            }

            csv.NextRecord();
        }

        private static DateTime GetIntervaloDataHora(DateTime date, string intervalo)
        {
            return intervalo switch
            {
                "1 minuto" => new DateTime(date.Year, date.Month, date.Day, date.Hour, date.Minute / 1 * 1, 0),
                "10 minutos" => new DateTime(date.Year, date.Month, date.Day, date.Hour, date.Minute / 10 * 10, 0),
                "30 minutos" => new DateTime(date.Year, date.Month, date.Day, date.Hour, date.Minute / 30 * 30, 0),
                "1 hora" => new DateTime(date.Year, date.Month, date.Day, date.Hour, 0, 0),
                "24 horas" => new DateTime(date.Year, date.Month, date.Day, 0, 0, 0),
                "Mensal" => new DateTime(date.Year, date.Month, 1, 0, 0, 0),
                _ => throw new ArgumentException("Intervalo inválido"),
            };
        }
    }
}