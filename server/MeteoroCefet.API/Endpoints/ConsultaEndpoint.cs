using MeteoroCefet.Application.Models;
using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;

namespace MeteoroCefet.API.Endpoints
{
    public class ConsultaEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("/consulta", Handler);
        }

        private static async Task<List<DadosTempo>> Handler([FromServices] DadosTempoRepository repository, [FromBody] ConsultaModel model)
        {
            var cu = model.Chuva;
            return await repository.Get(x => x.Precipitacao > 0);
        }
    }
}