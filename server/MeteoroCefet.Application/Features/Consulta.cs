
using MediatR;
using MeteoroCefet.Application.Models;
using MeteoroCefet.Domain.Repositories;
using MeteoroCefet.Infra;
using MongoDB.Driver;
using System.Globalization;

namespace MeteoroCefet.Application.Features
{
    public record ConsultaRequest(ConsultaModel Model) : IRequest<IEnumerable<Dictionary<string, object?>>>;
    public class ConsultaHandler : IRequestHandler<ConsultaRequest, IEnumerable<Dictionary<string, object?>>>
    {
        private readonly DadosTempoRepository _repository;

        public ConsultaHandler(DadosTempoRepository repository)
        {
            _repository = repository;
        }
        public async Task<IEnumerable<Dictionary<string, object?>>> Handle(ConsultaRequest request, CancellationToken ct)
        {
            var model = request.Model;

            model.PeriodoFim = model.PeriodoFim.AddHours(23).AddMinutes(59);

            var result = await _repository.Collection
                .Find(x => x.DataHora >= model.PeriodoInicio && x.DataHora <= model.PeriodoFim && model.Estacao.Contains(x.Estacao))
                .SortBy(x => x.Estacao)
                .ToListAsync(ct);

            var groupedByIntervalo = result.GroupBy(x => new
            {
                x.Estacao,
                DataHora = GetIntervaloDataHora(x.DataHora.AddHours(-3), model.Intervalo)
            });

            return groupedByIntervalo.Select(g => new Dictionary<string, object?>
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
            }).Select(x => x.Where(y => y.Value != null).ToDictionary(x => x.Key, x => x.Value));
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
