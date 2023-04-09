using MeteoroCefet.Application.Models;
using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

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
            model.PeriodoFim = model.PeriodoFim.AddHours(23).AddMinutes(59);

            var result = await repository
                .Collection
                .Find(x => x.DataHora >= model.PeriodoInicio && x.DataHora <= model.PeriodoFim && model.Estacao.Contains(x.Estacao))
                .SortBy(x => x.Estacao)
                .ToListAsync();

            var groupedIntervalo = result.GroupBy(x => new {
                x.Estacao,
                DataHora = GetIntervaloDataHora(x.DataHora, model.Intervalo)
            })
                        .Select(g => new ConsultaResultModel
                        {
                            DataHora = g.Key.DataHora,
                            Estacao = g.Key.Estacao,
                            TempAr = Math.Round(g.Average(x => x.TemperaturaAr), 2),
                            TempMin = Math.Round(g.Min(x => x.TemperaturaAr), 2),      
                            TempMax = Math.Round(g.Max(x => x.TemperaturaAr), 2) ,       // > Filtro para ignorar campos
                            TempOrv = Math.Round(g.Average(x => x.TempPontoOrvalho), 2),    
                            Chuva = Math.Round(g.Average(x => x.Precipitacao), 2),         
                            DirecaoVento = Math.Round(g.Average(x => x.DirecaoVento), 2),      // > Produzir o CSV e o grafico no backend
                            VelocidadeVento = Math.Round(g.Average(x => x.VelocidadeVento), 2),
                            VelocidadeVentoMax = g.Max(x => x.VelocidadeVento),
                            Bateria = Math.Round(g.Average(x => x.Bateria), 2),
                            Radiacao = Math.Round(g.Average(x => x.RadSolar), 2),
                            PressaoATM = Math.Round(g.Average(x => x.Pressao), 2),
                            IndiceCalor = Math.Round(g.Average(x => x.IndiceCalor), 2),
                            UmidadeRelativa = Math.Round(g.Average(x => x.Extra2), 2),
                        })
                        .ToList();

            return groupedIntervalo;
        }
        private static DateTime GetIntervaloDataHora(DateTime date, string intervalo)
        {
            var dataHora = intervalo switch
            {
                "1 minuto" => new DateTime(date.Year, date.Month, date.Day, date.Hour, date.Minute / 1 * 1, 0),
                "10 minutos" => new DateTime(date.Year, date.Month, date.Day, date.Hour, date.Minute / 10 * 10, 0),
                "30 minutos" => new DateTime(date.Year, date.Month, date.Day, date.Hour, date.Minute / 30 * 30, 0),
                "1 hora" => new DateTime(date.Year, date.Month, date.Day, date.Hour, date.Minute / 60 * 60, 0),
                "24 horas" => new DateTime(date.Year, date.Month, date.Day, 0, 0, 0),
                "Mensal" => new DateTime(date.Year, date.Month, 1, 0, 0, 0),
                _ => throw new ArgumentException("Intervalo inválido"),
            };
            return dataHora;
        }
    }
}


