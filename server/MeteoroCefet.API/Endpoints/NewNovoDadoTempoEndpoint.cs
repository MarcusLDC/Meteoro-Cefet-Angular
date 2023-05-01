using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra.BackgroundServices;
using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace MeteoroCefet.API.Endpoints
{
    public class NewNovoDadoTempoEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("dados/novo", Handler);
        }

        private static Guid Handler([FromServices] DadosTempoRepository dadosTempoRepository, [FromServices] EstacaoRepository estacaoRepository, [FromServices] ILogger<string> log, List<KeyAndMessagePairs> pares)
        {
            foreach(var par in pares)
            {
                log.LogInformation("Recebi: {par.Key}:{par.Message}", par.Key, par.Message);
            }

            return new Guid();
        }
        public class KeyAndMessagePairs
        {
            public string Key { get; set; }
            public string Message { get; set; }
        }
    }
}
