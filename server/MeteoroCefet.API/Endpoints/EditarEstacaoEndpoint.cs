using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;

namespace MeteoroCefet.API.Endpoints
{
    public class EditarEstacaoEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("/estacoesEditar", Handler);
        }
        private static async void Handler([FromServices] EstacaoRepository repository, [FromBody] Estacao estacao)
        {
            await repository.Replace(estacao.Id, estacao);
        }
    }
}
