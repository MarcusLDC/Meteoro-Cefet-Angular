using MeteoroCefet.Application.Models;
using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;

namespace MeteoroCefet.API.Endpoints
{
    public class ConsultaEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("/consulta", Handler);
        }

        private static async Task<List<DadosTempo>> Handler(DadosTempoRepository repository, ConsultaModel model)
        {
            return await repository.Get((x) => x.Pressao > 0);
        }
    }
}