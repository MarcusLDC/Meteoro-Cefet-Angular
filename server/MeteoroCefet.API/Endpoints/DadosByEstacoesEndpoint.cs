using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;

namespace MeteoroCefet.API.Endpoints
{
    public class DadosByEstacoesEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("/dadosEstacoes", Handler);
        }
        private static async Task<List<DadosTempo>> Handler([FromServices] DadosTempoRepository repository, [FromBody] EstacoesParams p)
        {
            return await repository.GetLastEstacoes(p.NumeroEstacao, p.NumPagina, 100);
        }
        private record EstacoesParams(List<int> NumeroEstacao, int NumPagina);
    }
}
