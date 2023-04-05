using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace MeteoroCefet.API.Endpoints
{
    public class EditarEstacaoEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("/estacoesEditar", Handler).RequireAuthorization("RequireAdmin");
        }
        private static async void Handler([FromServices] ILogger<EditarEstacaoEndpoint> log, [FromServices] EstacaoRepository repository, [FromBody] Estacao estacao)
        {
            await repository.ReplaceEstacao(estacao.Numero, estacao);
        }
    }
}
