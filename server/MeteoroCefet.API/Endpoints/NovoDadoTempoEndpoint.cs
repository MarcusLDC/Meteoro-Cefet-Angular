using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace MeteoroCefet.API.Endpoints
{
    public class NovoDadoTempoEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("dados/new", Handler);
        }

        private static async Task<Guid> Handler([FromServices] DadosTempoRepository dadosTempoRepository, [FromServices] EstacaoRepository estacaoRepository, [FromServices] ILogger<NovoDadoTempoEndpoint> log, HttpRequest req)
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
                UmidadeRelativaAr = ConverteInt(pedacinhos[3]),
                Pressao = ConverteDouble(pedacinhos[4]),
                RadSolar = ConverteInt(pedacinhos[5]),
                Precipitacao = ConverteDouble(pedacinhos[6]),
                DirecaoVento = ConverteInt(pedacinhos[7]),
                VelocidadeVento = ConverteInt(pedacinhos[8]),
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

            var estacaoExiste = await estacaoRepository.Collection.Find(x => x.Numero == dado.Estacao).AnyAsync();

            if (!estacaoExiste)
            {
                var estacao = new Estacao { Numero = dado.Estacao };
                await estacaoRepository.Add(estacao);
                log.LogInformation("Nova estação adicionada: {estacao}", estacao);
            }

            return await dadosTempoRepository.Add(dado);
        }

        private static double ConverteDouble(string text)
        {
            _ = double.TryParse(text, out var result);
            return double.IsNaN(result) ? 0 : result;
        }
        private static int ConverteInt(string text)
        {
            _ = int.TryParse(text, out var result);
            return result;
        }
    }
}