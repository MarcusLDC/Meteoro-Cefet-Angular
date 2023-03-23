using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;

namespace MeteoroCefet.API.Endpoints
{
    public class NovoDadoTempoEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("dados/new", Handler);
        }
        private static async Task<Guid> Handler([FromServices] DadosTempoRepository repository,[FromServices] EstacaoRepository estacaoRepository, [FromServices] ILogger<NovoDadoTempoEndpoint> log, HttpRequest req)
        {
            var msg = req.Form["msg"];
            var key = req.Form["key"];

            log.LogInformation("Recebi: {msg} {key}", msg, key);
            var pedacinhos = msg.First()!.Split(";");

            var dataHora = DateTime.Now;
            var estacao = int.Parse(pedacinhos[1]);
            var temperaturaAr = ConverteDouble(pedacinhos[2]);
            var umidadeRelativaAr = ConverteInt(pedacinhos[3]);
            var pressao = ConverteDouble(pedacinhos[4]);
            var radSolar = ConverteInt(pedacinhos[5]);
            var precipitacao = ConverteDouble(pedacinhos[6]);
            var direcaoVento = ConverteInt(pedacinhos[7]);
            var velocidadeVento = ConverteInt(pedacinhos[8]);
            var tempPontoOrvalho = ConverteDouble(pedacinhos[9]);
            var indiceCalor = ConverteDouble(pedacinhos[10]);
            var deficitPressaoVapor = ConverteDouble(pedacinhos[11]);
            var bateria = ConverteDouble(pedacinhos[12]);
            var extra1 = ConverteDouble(pedacinhos[13]);
            var extra2 = ConverteDouble(pedacinhos[14]);
            var extra3 = ConverteDouble(pedacinhos[15]);
            var extra4 = ConverteDouble(pedacinhos[16]);
            var status = pedacinhos[17];

            var dado = new DadosTempo
            {
                DataHora = dataHora,
                Estacao = estacao,
                TemperaturaAr = temperaturaAr,
                UmidadeRelativaAr = umidadeRelativaAr,
                Pressao = pressao,
                RadSolar = radSolar,
                Precipitacao = precipitacao,
                DirecaoVento = direcaoVento,
                VelocidadeVento = velocidadeVento,
                TempPontoOrvalho = tempPontoOrvalho,
                IndiceCalor = indiceCalor,
                DeficitPressaoVapor = deficitPressaoVapor,
                Bateria = bateria,
                Extra1 = extra1,
                Extra2 = extra2,
                Extra3 = extra3,
                Extra4 = extra4,
                Status = status
            };

            var estacoes = new Estacao
            {
                Numero = estacao
            };

            log.LogInformation("Estacao: {estacoes.Numero}", estacoes.Numero);

            var listaEstacoes = await estacaoRepository.Get(_ => true);

            log.LogInformation("Lista de estacoes: {listaEstacoes}", listaEstacoes);

            

            return await repository.Add(dado);
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