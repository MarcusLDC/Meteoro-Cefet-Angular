using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;

namespace MeteoroCefet.API.Endpoints
{
    public class DadosDiarioByEstacaoEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("/dados/diario", Handler);
        }

        private static async Task<List<DadosTempo>> Handler(DadosTempoRepository repository, [FromBody] GetLastDayByEstacaoParams parameters)
        {
            return await repository.GetLastDayByEstacao(parameters.NumPagina, parameters.NumEstacao);
        }
        private record GetLastDayByEstacaoParams (int NumPagina, int NumEstacao) { }
    }
}
