using MeteoroCefet.Domain.Entities;
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
        private static async Task<NewUserDTO> Handler([FromServices] ILogger<ApplicationUser> log, [FromServices] UserManager<ApplicationUser> userManager, [FromBody] UserInformationDTO userDTO)
        {
            var usuario = await userManager.FindByNameAsync(userDTO.Username);

            if (usuario is null)
            {
                return new() { Success = false, Message = "Cancelando." };
            }

            await userManager.DeleteAsync(usuario);
            return new() { Success = true, Message = "Moderador deletado!" };
        }
    }
}
