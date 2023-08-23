using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra.BackgroundServices;
using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace MeteoroCefet.API.Endpoints
{
    public class NovoDadoDeTempoEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("dados/novo", Handler);
        }

        private static async Task<Guid> Handler([FromServices] DadosTempoRepository dadosTempoRepository, [FromServices] EstacaoRepository estacaoRepository, [FromServices] ILogger<NovoDadoTempoEndpoint> log, [FromServices] ShutdownStationsBackgroundService shutdownServices, HttpRequest req)
        {
            var msg = req.Form["msg"];
            var key = req.Form["key"];

            log.LogInformation("Recebi: {msg} {key}", msg, key);
            var pedacinhos = msg.First()!.Split(";");

            var dado = new DadosTempo
            {
                DataHora = DateTime.Now,
                Estacao = int.Parse(pedacinhos[1]),
                TemperaturaAr = ConverteDouble(pedacinhos[2]),
                UmidadeRelativaAr = ConverteDouble(pedacinhos[3]),
                Pressao = ConverteDouble(pedacinhos[4]),
                RadSolar = ConverteDouble(pedacinhos[5]),
                Precipitacao = ConverteDouble(pedacinhos[6]),
                DirecaoVento = ConverteDouble(pedacinhos[7]),
                VelocidadeVento = ConverteDouble(pedacinhos[8]),
                TempPontoOrvalho = ConverteDouble(pedacinhos[9]),
                IndiceCalor = ConverteDouble(pedacinhos[10]),
                DeficitPressaoVapor = ConverteDouble(pedacinhos[11]),
                Bateria = ConverteDouble(pedacinhos[12]),
                Extra1 = ConverteDouble(pedacinhos[13]),
                Extra2 = ConverteDouble(pedacinhos[14]),
                Extra3 = ConverteDouble(pedacinhos[15]),
                Extra4 = ConverteDouble(pedacinhos[16]),
                Extra5 = ConverteDouble(pedacinhos[17]),
                Extra6 = ConverteDouble(pedacinhos[18]),
                Status = pedacinhos[19]
            };

            await StationGuarantees(estacaoRepository, log, shutdownServices, dado); //tem que mover esses serviços para uma classe Service / Handler

            return await dadosTempoRepository.Add(dado);
        }

        private static async Task StationGuarantees(EstacaoRepository estacaoRepository, ILogger<NovoDadoTempoEndpoint> log, ShutdownStationsBackgroundService shutdownServices, DadosTempo dado)
        {
            var estacao = await estacaoRepository.Collection.Find(x => x.Numero == dado.Estacao).FirstOrDefaultAsync();

            if (estacao is null)
            {
                var novaEstacao = new Estacao { Numero = dado.Estacao, DataInicio = dado.DataHora, Status = Status.Funcionando };
                await estacaoRepository.Add(novaEstacao);
                shutdownServices.ScheduleStationShutdown(dado.Estacao);
                log.LogInformation("Nova estação adicionada: {estacao}", novaEstacao);
                return;
            }

            if (estacao.Status == Status.Desligada)
            {
                await estacaoRepository.AlterarStatus(estacao.Numero, Status.Funcionando);
                shutdownServices.ScheduleStationShutdown(dado.Estacao);
            }
        }

        private static double ConverteDouble(string text)
        {
            _ = double.TryParse(text, out var result);
            return double.IsNaN(result) ? 0 : result;
        }
    }
}
