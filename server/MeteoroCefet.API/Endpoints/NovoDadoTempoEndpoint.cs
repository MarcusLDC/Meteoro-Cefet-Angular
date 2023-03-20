namespace MeteoroCefet.API.Endpoints
{
    public class NovoDadoTempoEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("dados/new", Handler);
        }
        private static async Task<string> Handler(string msg, string key)
        {
            return msg;
        }
    }
}