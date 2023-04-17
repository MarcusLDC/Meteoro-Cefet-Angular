using MediatR;
using MeteoroCefet.Application.Models;
using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using MongoDB.Driver;

namespace MeteoroCefet.Application.Features
{
    public record ConsultaRequest(ConsultaModel Model) : IRequest<ConsultaDTO>;
    public class ConsultaHandler : IRequestHandler<ConsultaRequest, ConsultaDTO>
    {
        private readonly DadosTempoRepository _repository;

        public ConsultaHandler(DadosTempoRepository repository)
        {
            _repository = repository;
        }

        public async Task<ConsultaDTO> Handle(ConsultaRequest request, CancellationToken ct)
        {
            var model = request.Model;

            model.PeriodoFim = model.PeriodoFim.AddHours(23).AddMinutes(59);

            var wthinPeriod = await _repository
                .Collection
                .Find(x => x.DataHora >= model.PeriodoInicio && x.DataHora <= model.PeriodoFim && model.Estacao.Contains(x.Estacao))
                .SortBy(x => x.DataHora)
                .ToListAsync(ct);

            var groupedByStation = wthinPeriod
                .GroupBy(x => x.Estacao)
                .Select(x => new { Estacao = x.Key, GroupedByData = x.GroupBy(x => FlattenDataRange(x.DataHora.AddHours(-3), model.Intervalo)) });

            var mapping = GetMapping(model);

            var stationData = groupedByStation.Select(x => new StationData()
            {
                Station = x.Estacao,
                Statistics = x.GroupedByData.Select(y => MeasureDataStatistics(y.ToList(), y.Key, mapping)).ToList()
            });

            return new ConsultaDTO
            {
                SelectedFields = mapping.Where(x => x.Value.Selected).Select(x => x.Key).ToList(),
                StationsData = stationData.ToList()
            };
        }

        private static Data MeasureDataStatistics(List<DadosTempo> dadosTempos, DateTime date, Dictionary<Campo, (bool Selected, Func<List<DadosTempo>, double> MeasureStatistics)> mapping)
        {
            var getMeasures = mapping.Values.Select(x => x.MeasureStatistics).ToList();

            return new Data
            {
                Points = getMeasures.Select(measure => measure(dadosTempos)).ToList(),
                Date = date
            };
        }

        private static Dictionary<Campo, (bool Selected, Func<List<DadosTempo>, double> MeasureStatistics)> GetMapping(ConsultaModel model)
        {
            return new Dictionary<Campo, (bool Selected, Func<List<DadosTempo>, double> MeasureStatistics)>()
            {
                { Campo.TempAr, (model.TempAr, Average(x => x.TemperaturaAr))},
                { Campo.TempMin, (model.TempMin, Min(x => x.TemperaturaAr))},
                { Campo.TempMax, (model.TempMax, Max(x => x.TemperaturaAr))},
                { Campo.TempOrv, (model.TempOrv, Average(x => x.TempPontoOrvalho))},

                { Campo.Chuva, (model.Chuva, Average(x => x.Precipitacao))},
                { Campo.DirecaoVento, (model.DirecaoVento, Average(x => x.DirecaoVento))},
                { Campo.VelocidadeVento, (model.VelocidadeVento, Average(x => x.VelocidadeVento))},
                { Campo.VelocidadeVentoMax, (model.VelocidadeVentoMax, Max(x => x.VelocidadeVento))},

                { Campo.Bateria, (model.Bateria, Average(x => x.Bateria))},
                { Campo.Radiacao, (model.Radiacao, Average(x => x.RadSolar))},
                { Campo.PressaoATM, (model.PressaoATM, Average(x => x.Pressao))},
                { Campo.IndiceCalor, (model.IndiceCalor, Average(x => x.IndiceCalor))},
                { Campo.UmidadeRelativa, (model.UmidadeRelativa, Average(x => x.UmidadeRelativaAr))},
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

        private static Func<List<DadosTempo>, double> Average(Func<DadosTempo, double> selector)
        {
            return data => Math.Round(data.Average(selector), 2);
        }
        private static Func<List<DadosTempo>, double> Min(Func<DadosTempo, double> selector)
        {
            return data => Math.Round(data.Min(selector), 2);
        }
        private static Func<List<DadosTempo>, double> Max(Func<DadosTempo, double> selector)
        {
            return data => Math.Round(data.Min(selector), 2);
        }
    }

    public class ConsultaDTO
    {
        public required List<Campo> SelectedFields { get; init; }
        public required List<StationData> StationsData { get; set; }
    }

    public class StationData
    {
        public required List<Data> Statistics { get; init; }
        public required int Station { get; init; }
    }

    public class Data
    {
        public required DateTime Date { get; init; }
        public required List<double> Points { get; init; }
    }
}