using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;

namespace MeteoroCefet.API.Endpoints
{
    public class DadosByEstacaoEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("/dadosPorEstacao", Handler);
        }
        private static async Task<List<DadosTempo>> Handler([FromServices] DadosTempoRepository repository, [FromBody] Params p)
        {
            return await repository.GetLastEstacao(p.NumeroEstacao, p.NumPagina, 100);
        }
        private record Params(int NumeroEstacao, int NumPagina);
    }
}