using MeteoroCefet.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MeteoroCefet.API.Endpoints
{
    public class NovoModeradorEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("usuario/moderador/new", Handler);
        }
        private static async Task<NewUserDTO> Handler([FromServices] UserManager<ApplicationUser> userManager, [FromBody] UserInformationDTO userDTO)
        {
            var exists = await userManager.FindByNameAsync(userDTO.Username) is null;

            if (exists)
            {
                return new() { Success = false, Message = "Nome de usuário já existe, cancelando." };
            }

            ApplicationUser user = new()
            {
                Username = userDTO.Username,
            };
            await userManager.CreateAsync(user, userDTO.Password);

            await userManager.AddToRoleAsync(user, "Moderador");

            return new() { Success = true, Message = "Moderador criado com sucesso!"};
        }
    }
}
