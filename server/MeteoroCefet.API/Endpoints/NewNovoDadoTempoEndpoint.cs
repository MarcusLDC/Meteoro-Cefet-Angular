using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra.BackgroundServices;
using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using MongoDB.Driver;

namespace MeteoroCefet.API.Endpoints
{
    public class NewNovoDadoTempoEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("dados/novo", Handler);
        }

        private static void Handler([FromServices] DadosTempoRepository dadosTempoRepository, [FromServices] EstacaoRepository estacaoRepository, [FromServices] ILogger<string> log, List<KeyAndMessagePairs> pares)
        {

            var authorized = false;

            if(pares[0].Key == "Estacao")
            {
                var estacao = estacaoRepository.Collection.Find(x => x.Numero == int.Parse(pares[0].Message)).FirstOrDefault();

                if (estacao.Senha == pares[1].Message)
                {
                    authorized = true;
                }
            }

            if(authorized)
            {
                log.LogInformation("autorizado");
            }

            return;
        }
        public class KeyAndMessagePairs
        {
            public string Key { get; set; }
            public string Message { get; set; }
        }
    }
}
