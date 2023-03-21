using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace MeteoroCefet.API.Endpoints
{
    public class EstacoesEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapGet("/estacoes", Handler);
        }
        private static async Task<List<Estacao>> Handler([FromServices] EstacaoRepository repository)
        {
            return await repository.Collection.Find(_ => true).SortBy(x => x.Numero).ToListAsync();
        }
    }
}
