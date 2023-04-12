using MeteoroCefet.Infra;
using MongoDB.Driver;

namespace MeteoroCefet.API.Endpoints
{
    public class DadosCountEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapGet("/dados/total", Handler);
        }

        private static async Task<long> Handler(DadosTempoRepository repository)
        {
            return await repository.Collection.CountDocumentsAsync(_ => true);
        }
    }
}
