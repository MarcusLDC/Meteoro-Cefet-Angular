using MeteoroCefet.Application;
using Microsoft.AspNetCore.Mvc;

namespace MeteoroCefet.API.Endpoints
{
    public class NovoModeradorEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("usuario/moderador/new", Handler).RequireAuthorization("RequireAdmin");
        }
        private static async Task<UserRegisterResponse> Handler([FromServices] IdentityService identityService, [FromBody] UserRegisterRequest userRegisterRequest)
        {
            return await identityService.RegisterUser(userRegisterRequest);
        }
    }
}