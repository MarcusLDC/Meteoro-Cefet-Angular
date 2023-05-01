using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace MeteoroCefet.API.Endpoints
{
    public class CadastrarEstacaoEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("estacao/cadastrar", Handler).RequireAuthorization("RequireAdmin");
        }
        private async static void Handler([FromServices] EstacaoRepository estacaoRepository, [FromServices] ILogger<string> log, [FromBody] CriarEstacaoParams estacaoCadastro)
        {

            var novaEstacao = new Estacao { Numero = estacaoCadastro.Numero, Senha = estacaoCadastro.Senha};
            await estacaoRepository.Add(novaEstacao);

        }
        private record CriarEstacaoParams(int Numero, string Senha);
    }
}
