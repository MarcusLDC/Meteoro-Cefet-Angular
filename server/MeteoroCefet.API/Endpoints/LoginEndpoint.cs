using Microsoft.AspNetCore.Mvc;
using MeteoroCefet.Application;

namespace MeteoroCefet.API.Endpoints
{
    public class LoginEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("/login", Handler);
        }

        private static async Task<UserLoginResponse> Handler([FromServices] ILogger<LoginEndpoint> log, [FromServices] IdentityService identityService, [FromBody] UserLoginRequest loginRequest)
        {
            var response = await identityService.Login(loginRequest);

            if (!response.Success)
            {
                log.LogInformation("Tentativa de login com usuário inválido: {userDTO.Username}", loginRequest.Username);
            }

            log.LogInformation("Tentativa de login: {userDTO.Username} , Status de acesso: {acesso} ", loginRequest.Username, response.Success);

            return response;
        }
    }
}