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
            app.MapPost("/estacoesEditar", Handler);
        }
        private static async void Handler([FromServices] ILogger<EditarEstacaoEndpoint> log, [FromServices] EstacaoRepository repository, [FromBody] Estacao estacao)
        {
            log.LogInformation("Troquei: {estacao.Numero} {estacao}", estacao.Numero, estacao);
            await repository.ReplaceEstacao(estacao.Numero, estacao);
        }
    }
}
