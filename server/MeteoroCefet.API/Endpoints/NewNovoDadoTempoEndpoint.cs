using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra.BackgroundServices;
using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;

namespace MeteoroCefet.API.Endpoints
{
    public class NewNovoDadoTempoEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("dados/novo", Handler);
        }

        private static Guid Handler([FromServices] DadosTempoRepository dadosTempoRepository, [FromServices] EstacaoRepository estacaoRepository, [FromServices] ILogger<NovoDadoTempoEndpoint> log, HttpRequest req)
        {
            var msg = req.Form["msg"];
            var key = req.Form["key"];

            log.LogInformation("Recebi: {msg} {key}", msg, key);

            return new Guid();
        }
    }
}
