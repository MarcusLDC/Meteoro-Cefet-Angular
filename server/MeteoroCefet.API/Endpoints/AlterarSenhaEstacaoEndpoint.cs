using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;

namespace MeteoroCefet.API.Endpoints
{
    public class AlterarSenhaEstacaoEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("/estacoes/alterarSenha", Handler).RequireAuthorization("RequireAdmin");
        }
        private static async Task<bool> Handler([FromServices] ILogger<AlterarSenhaEstacaoEndpoint> log, [FromServices] EstacaoRepository repository, [FromBody] AlterarSenhaEstacaoParams novaSenha)
        {
            await repository.ReplaceSenha(novaSenha.Numero, novaSenha.Senha);

            return true;
        }
        private record AlterarSenhaEstacaoParams(int Numero, string Senha);
    }
}