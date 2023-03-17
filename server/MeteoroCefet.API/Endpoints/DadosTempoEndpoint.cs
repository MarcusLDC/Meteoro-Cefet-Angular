using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;

namespace MeteoroCefet.API.Endpoints
{
    public class DadosTempoEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("/dados", Handler);
        }

        private static async Task<List<DadosTempo>> Handler(DadosTempoRepository repository, [FromBody] int numPagina)
        {
            return await repository.GetPaginated(numPagina, 100);
        }
    }
}