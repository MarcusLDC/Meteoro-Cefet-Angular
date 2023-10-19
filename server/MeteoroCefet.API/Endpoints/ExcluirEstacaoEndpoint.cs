using MeteoroCefet.Application;
using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace MeteoroCefet.API.Endpoints
{
    public class ExcluirEstacaoEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("estacao/delete", Handler)//.RequireAuthorization("RequireAdmin")
                                                  ;
        }

        private static async Task<string> Handler([FromServices] ILogger<ExcluirEstacaoEndpoint> log, EstacaoRepository estacaoRepository, DadosTempoRepository dadosTempoRepository, [FromBody] ExcluirEstacaoParams p)
        {

            var estacao = await estacaoRepository.Collection.Find(x => x.Numero == p.Numero).FirstOrDefaultAsync();

            if (estacao is null)
            {
                log.LogInformation("Tentativa de exclusão: Estacao {estacao} não existe", p.Numero);
                return "Estação não existe";
            }

            if(estacao.Senha != p.Senha)
            {
                log.LogInformation("Tentativa de exclusão: Senha incorreta");
                return "Senha incorreta";
            }

            var resultado = await estacaoRepository.DeleteStation(p.Numero) && await dadosTempoRepository.DeleteDataByStation(p.Numero) ? "Estação " + p.Numero + " e dados excluídos!" : "Ocorreu um erro inesperado";

            log.LogInformation("{resultado}", resultado);

            return resultado;
        }
        private record ExcluirEstacaoParams(int Numero, string Senha);
    }
}
