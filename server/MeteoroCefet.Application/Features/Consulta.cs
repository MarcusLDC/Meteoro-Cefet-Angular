using MediatR;
using MeteoroCefet.Application.Models;
using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using MongoDB.Driver;
using System.Globalization;

namespace MeteoroCefet.Application.Features
{
    public record ConsultaRequest(ConsultaModel Model) : IRequest<Dictionary<int, List<ConsultaDTO>>>;
    public class ConsultaHandler : IRequestHandler<ConsultaRequest, Dictionary<int, List<ConsultaDTO>>>
    {
        private readonly DadosTempoRepository _repository;

        public ConsultaHandler(DadosTempoRepository repository)
        {
            _repository = repository;
        }

        public async Task<Dictionary<int, List<ConsultaDTO>>> Handle(ConsultaRequest request, CancellationToken ct)
        {
            var model = request.Model;

            model.PeriodoFim = model.PeriodoFim.AddHours(23).AddMinutes(59);

            var wthinPeriod = await _repository
                .Collection
                .Find(x => x.DataHora >= model.PeriodoInicio && x.DataHora <= model.PeriodoFim && model.Estacao.Contains(x.Estacao))
                .SortBy(x => x.Estacao)
                .ToListAsync(ct);

            var groupedByStation = wthinPeriod
                .GroupBy(x => x.Estacao)
                .Select(x => new { Estacao = x.Key, GroupedByData = x.GroupBy(x => FlattenDataRange(x.DataHora.AddHours(-3), model.Intervalo)) });

            var dataStatistics = groupedByStation.Select(x => x.GroupedByData.Select(g => new ConsultaDTO
            {
                Estacao = x.Estacao,
                DataHora = g.Key.ToString("g", new CultureInfo("pt-BR")),
                Campos = MeasureDataStatistics(g, model).Where(y => y.Value is not null).ToDictionary(x => x.Key, x => x.Value!)
            }));

            return dataStatistics
                .SelectMany(x => x)
                .GroupBy(x => x.Estacao)
                .ToDictionary(x => x.Key, x => x.ToList());
        }

        private static Dictionary<string, object?> MeasureDataStatistics(IGrouping<DateTime, DadosTempo> rangeData, ConsultaModel model)
        {
            return new Dictionary<string, object?>
            {
                { "Temp. Ar" , model.TempAr ? Math.Round(rangeData.Average(x => x.TemperaturaAr), 2) : null},
                { "Temp. Min" , model.TempMin ? Math.Round(rangeData.Min(x => x.TemperaturaAr), 2) : null},
                { "Temp. Max" , model.TempMax ? Math.Round(rangeData.Max(x => x.TemperaturaAr), 2) : null},
                { "Temp. Orv" , model.TempOrv ? Math.Round(rangeData.Average(x => x.TempPontoOrvalho), 2) : null},

                { "Chuva" , model.Chuva ? Math.Round(rangeData.Average(x => x.Precipitacao), 2) : null},
                { "Direcao Vento" , model.DirecaoVento ? Math.Round(rangeData.Average(x => x.DirecaoVento), 2) : null},
                { "VelocidadeVento" , model.VelocidadeVento ? Math.Round(rangeData.Average(x => x.VelocidadeVento), 2) : null},
                { "VelocidadeVentoMax" , model.VelocidadeVentoMax ? rangeData.Max(x => x.VelocidadeVento) : null},

                { "Bateria" , model.Bateria ? Math.Round(rangeData.Average(x => x.Bateria), 2) : null},
                { "Radiacao" , model.Radiacao ? Math.Round(rangeData.Average(x => x.RadSolar), 2) : null},
                { "Pressao ATM" , model.PressaoATM ? Math.Round(rangeData.Average(x => x.Pressao), 2) : null},
                { "Indice Calor" , model.IndiceCalor ? Math.Round(rangeData.Average(x => x.IndiceCalor), 2) : null},
                { "Umidade Relativa" , model.UmidadeRelativa ?  Math.Round(rangeData.Average(x => x.UmidadeRelativaAr), 2) : null}
            };
        }

        private static DateTime FlattenDataRange(DateTime date, string intervalo)
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

    public class ConsultaDTO
    {
        public required int Estacao { get; set; }
        public required string DataHora { get; set; }
        public required Dictionary<string, object> Campos { get; set; }
    }
}