using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra.BackgroundServices;
using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using CsvHelper.TypeConversion;

namespace MeteoroCefet.API.Endpoints
{
    public class NovoDadoDeTempoEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("dados/novo", Handler);
        }

        private static async Task<Guid> Handler([FromServices] DadosTempoRepository dadosTempoRepository, [FromServices] EstacaoRepository estacaoRepository, [FromServices] ILogger<NovoDadoDeTempoEndpoint> log, [FromServices] ShutdownStationsBackgroundService shutdownServices, HttpRequest req)
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

            return await dadosTempoRepository.Add(await ChecarLimites(estacaoRepository, log, dado));
        }

        private async static Task<DadosTempo> ChecarLimites(EstacaoRepository estacaoRepository, ILogger<NovoDadoDeTempoEndpoint> log, DadosTempo dado)
        {
            var estacao = await estacaoRepository.Collection.Find(x => x.Numero == dado.Estacao).FirstOrDefaultAsync();

            log.LogInformation("Checando limites na estacao: {estacao}", estacao.Numero);

            if (estacao is null)
            {
                return dado;
            }

            var novoDado = new DadosTempo
            {
                DataHora = dado.DataHora,
                Estacao = dado.Estacao,

                TemperaturaAr = (estacao.TempMax == 0 && estacao.TempMin == 0) ? dado.TemperaturaAr :
                    (dado.TemperaturaAr <= estacao.TempMax && dado.TemperaturaAr >= estacao.TempMin) ? dado.TemperaturaAr : 0,

                UmidadeRelativaAr = (estacao.UmidadeMax == 0 && estacao.UmidadeMin == 0) ? dado.UmidadeRelativaAr :
                    (dado.UmidadeRelativaAr <= estacao.UmidadeMax && dado.UmidadeRelativaAr >= estacao.UmidadeMin) ? dado.UmidadeRelativaAr : 0,

                Pressao = (estacao.PressaoMax == 0 && estacao.PressaoMin == 0) ? dado.Pressao :
                    (dado.Pressao <= estacao.PressaoMax && dado.Pressao >= estacao.PressaoMin) ? dado.Pressao : 0,

                RadSolar = (estacao.RadiacaoSolarMax == 0 && estacao.RadiacaoSolarMin == 0) ? dado.RadSolar :
                    (dado.RadSolar <= estacao.RadiacaoSolarMax && dado.RadSolar >= estacao.RadiacaoSolarMin) ? dado.RadSolar : 0,

                Precipitacao = (estacao.ChuvaMax == 0 && estacao.ChuvaMin == 0) ? dado.Precipitacao :
                    (dado.Precipitacao <= estacao.ChuvaMax && dado.Precipitacao >= estacao.ChuvaMin) ? dado.Precipitacao : 0,

                DirecaoVento = (estacao.DirecaoVentoMax == 0 && estacao.DirecaoVentoMin == 0) ? dado.DirecaoVento :
                    (dado.DirecaoVento <= estacao.DirecaoVentoMax && dado.DirecaoVento >= estacao.DirecaoVentoMin) ? dado.DirecaoVento : 0,

                VelocidadeVento = (estacao.VelocidadeVentoMax == 0 && estacao.VelocidadeVentoMin == 0) ? dado.VelocidadeVento :
                     (dado.VelocidadeVento <= estacao.VelocidadeVentoMax && dado.VelocidadeVento >= estacao.VelocidadeVentoMin) ? dado.VelocidadeVento : 0,

                TempPontoOrvalho = (estacao.PontoOrvalhoMax == 0 && estacao.PontoOrvalhoMin == 0) ? dado.TempPontoOrvalho :
                     (dado.TempPontoOrvalho <= estacao.PontoOrvalhoMax && dado.TempPontoOrvalho >= estacao.PontoOrvalhoMin) ? dado.TempPontoOrvalho : 0,

                IndiceCalor = (estacao.IndiceCalorMax == 0 && estacao.IndiceCalorMin == 0) ? dado.IndiceCalor :
                    (dado.IndiceCalor <= estacao.IndiceCalorMax && dado.IndiceCalor >= estacao.IndiceCalorMin) ? dado.IndiceCalor : 0,

                DeficitPressaoVapor = (estacao.DeficitPressaoVaporMax == 0 && estacao.DeficitPressaoVaporMin == 0) ? dado.DeficitPressaoVapor :
                    (dado.DeficitPressaoVapor <= estacao.DeficitPressaoVaporMax && dado.DeficitPressaoVapor >= estacao.DeficitPressaoVaporMin) ? dado.DeficitPressaoVapor : 0,

                Bateria = (estacao.BateriaMax == 0 && estacao.BateriaMin == 0) ? dado.Bateria :
                    (dado.Bateria <= estacao.BateriaMax && dado.Bateria >= estacao.BateriaMin) ? dado.Bateria : 0,

                Extra1 = (estacao.Extra1Max == 0 && estacao.Extra1Min == 0) ? dado.Extra1 :
                    (dado.Extra1 <= estacao.Extra1Max && dado.Extra1 >= estacao.Extra1Min) ? dado.Extra1 : 0,

                Extra2 = (estacao.Extra2Max == 0 && estacao.Extra2Min == 0) ? dado.Extra2 :
                    (dado.Extra2 <= estacao.Extra2Max && dado.Extra2 >= estacao.Extra2Min) ? dado.Extra2 : 0,

                Extra3 = (estacao.Extra3Max == 0 && estacao.Extra3Min == 0) ? dado.Extra3 :
                    (dado.Extra3 <= estacao.Extra3Max && dado.Extra3 >= estacao.Extra3Min) ? dado.Extra3 : 0,

                Extra4 = (estacao.Extra4Max == 0 && estacao.Extra4Min == 0) ? dado.Extra4 :
                    (dado.Extra4 <= estacao.Extra4Max && dado.Extra4 >= estacao.Extra4Min) ? dado.Extra4 : 0,

                Extra5 = (estacao.Extra5Max == 0 && estacao.Extra5Min == 0) ? dado.Extra5 :
                    (dado.Extra5 <= estacao.Extra5Max && dado.Extra5 >= estacao.Extra5Min) ? dado.Extra5 : 0,

                Extra6 = (estacao.Extra6Max == 0 && estacao.Extra6Min == 0) ? dado.Extra6 :
                    (dado.Extra6 <= estacao.Extra6Max && dado.Extra6 >= estacao.Extra6Min) ? dado.Extra6 : 0,

                Status = dado.Status
            };

            return novoDado;
        }

        private static async Task StationGuarantees(EstacaoRepository estacaoRepository, ILogger<NovoDadoDeTempoEndpoint> log, ShutdownStationsBackgroundService shutdownServices, DadosTempo dado)
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
