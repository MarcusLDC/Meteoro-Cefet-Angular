using MeteoroCefet.Application;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MeteoroCefet.API.Endpoints
{
    public class ExcluirModeradorEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("usuario/delete", Handler);
        }

        private static async Task<Response<IdentityResult>> Handler([FromServices] ILogger<ExcluirModeradorEndpoint> log, [FromServices]  IdentityService identityService, [FromBody] ExcluirModeradorParams parameters)
        {
            return await identityService.DeleteUser(parameters.Username);
        }
        private record ExcluirModeradorParams(string Username);
    }
}
