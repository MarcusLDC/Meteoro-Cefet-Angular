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
        private static async void Handler([FromServices] ILogger<EditarEstacaoEndpoint> log, [FromServices] EstacaoRepository repository, [FromBody] AlterarSenhaEstacaoParams novaSenha)
        {
            await repository.ReplaceSenha(novaSenha.Numero, novaSenha.Senha);
        }
        private record AlterarSenhaEstacaoParams(int Numero, string Senha);
    }
}
