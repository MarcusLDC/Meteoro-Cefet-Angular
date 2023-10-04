using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using MeteoroCefet.Infra.BackgroundServices;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace MeteoroCefet.API.Endpoints
{
    public class NovoDadoTempoOldEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("dados/new", Handler);
        }

        private static async Task<Guid> Handler([FromServices] DadosTempoRepository dadosTempoRepository, [FromServices] EstacaoRepository estacaoRepository, [FromServices] ILogger<NovoDadoTempoOldEndpoint> log, [FromServices] ShutdownStationsBackgroundService shutdownServices, HttpRequest req)
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
                Status = pedacinhos[17]
            };

            await StationGuarantees(estacaoRepository, log, shutdownServices, dado); //tem que mover esses serviços para uma classe Service / Handler

            log.LogInformation("Recebi: {checar}", await ChecarLimites(estacaoRepository, log, dado));

            return await dadosTempoRepository.Add(dado);
        }

        private async static Task<DadosTempo> ChecarLimites(EstacaoRepository estacaoRepository, ILogger<NovoDadoTempoOldEndpoint> log, DadosTempo dado)
        {
            var estacao = await estacaoRepository.Collection.Find(x => x.Numero == dado.Estacao).FirstOrDefaultAsync();

            log.LogInformation("Checando limites na estacao: {estacao}", estacao);

            if (estacao is null)
            {
                return dado;
            }

            log.LogInformation("Dado Original de Temperatura: {temperatura} - {limiteMin} Min e {limiteMax} Max", dado.TemperaturaAr, estacao.TempMin, estacao.TempMax);

            var novoDado = new DadosTempo
            {
                DataHora = dado.DataHora,
                Estacao = dado.Estacao,

                TemperaturaAr = (dado.TemperaturaAr <= estacao.TempMax && dado.TemperaturaAr >= estacao.TempMin) ? dado.TemperaturaAr : 0,

                UmidadeRelativaAr = (dado.UmidadeRelativaAr <= estacao.UmidadeMax && dado.UmidadeRelativaAr >= estacao.UmidadeMin) ? dado.UmidadeRelativaAr : 0,

                Pressao = (dado.Pressao <= estacao.PressaoMax && dado.Pressao >= estacao.PressaoMin) ? dado.Pressao : 0,

                RadSolar = (dado.RadSolar <= estacao.RadiacaoSolarMax && dado.RadSolar >= estacao.RadiacaoSolarMin) ? dado.RadSolar : 0,

                Precipitacao = (dado.Precipitacao <= estacao.ChuvaMax && dado.Precipitacao >= estacao.ChuvaMin) ? dado.Precipitacao : 0,

                DirecaoVento = (dado.DirecaoVento <= estacao.DirecaoVentoMax && dado.DirecaoVento >= estacao.DirecaoVentoMin) ? dado.DirecaoVento : 0,

                VelocidadeVento = (dado.VelocidadeVento <= estacao.VelocidadeVentoMax && dado.VelocidadeVento >= estacao.VelocidadeVentoMin) ? dado.VelocidadeVento : 0,

                TempPontoOrvalho = (dado.TempPontoOrvalho <= estacao.PontoOrvalhoMax && dado.TempPontoOrvalho >= estacao.PontoOrvalhoMin) ? dado.TempPontoOrvalho : 0,

                IndiceCalor = (dado.IndiceCalor <= estacao.IndiceCalorMax && dado.IndiceCalor >= estacao.IndiceCalorMin) ? dado.IndiceCalor : 0,

                DeficitPressaoVapor = (dado.DeficitPressaoVapor <= estacao.DeficitPressaoVaporMax && dado.DeficitPressaoVapor >= estacao.DeficitPressaoVaporMin) ? dado.DeficitPressaoVapor : 0,

                Bateria = (dado.Bateria <= estacao.BateriaMax && dado.Bateria >= estacao.BateriaMin) ? dado.Bateria : 0,


                Extra1 = (dado.Extra1 <= estacao.Extra1Max && dado.Extra1 >= estacao.Extra1Min) ? dado.Extra1 : 0,

                Extra2 = (dado.Extra2 <= estacao.Extra2Max && dado.Extra2 >= estacao.Extra2Min) ? dado.Extra2 : 0,

                Extra3 = (dado.Extra3 <= estacao.Extra3Max && dado.Extra3 >= estacao.Extra3Min) ? dado.Extra3 : 0,

                Extra4 = (dado.Extra4 <= estacao.Extra4Max && dado.Extra4 >= estacao.Extra4Min) ? dado.Extra4 : 0,

                Extra5 = (dado.Extra5 <= estacao.Extra5Max && dado.Extra5 >= estacao.Extra5Min) ? dado.Extra5 : 0,

                Extra6 = (dado.Extra6 <= estacao.Extra6Max && dado.Extra6 >= estacao.Extra6Min) ? dado.Extra6 : 0,

                Status = dado.Status
            };

            log.LogInformation("Dado Novo de Temperatura: {temperatura} - {limiteMin} Min e {limiteMax} Max", novoDado.TemperaturaAr, estacao.TempMin, estacao.TempMax);

            return novoDado;
        }

        private static async Task StationGuarantees(EstacaoRepository estacaoRepository, ILogger<NovoDadoTempoOldEndpoint> log, ShutdownStationsBackgroundService shutdownServices, DadosTempo dado)
        {
            var estacao = await estacaoRepository.Collection.Find(x => x.Numero == dado.Estacao).FirstOrDefaultAsync();

            if (estacao is null)
            {
                var novaEstacao = new Estacao { Numero = dado.Estacao, DataInicio = dado.DataHora, Status = Status.Funcionando, UltimaModificacao = dado.DataHora };
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