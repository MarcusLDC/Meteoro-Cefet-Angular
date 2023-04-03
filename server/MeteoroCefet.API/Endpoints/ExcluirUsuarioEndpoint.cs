using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;
using MongoDB.Driver;

namespace MeteoroCefet.API.Endpoints
{
    public class ExcluirUsuarioEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("usuario/delete", Handler);
        }
        private static async Task<NewUserDTO> Handler([FromServices] ILogger<ApplicationUser> log, [FromServices] UsersRepository repository, [FromBody] UserInformationDTO userDTO)
        {
            var usuario = await repository.GetByUsername(userDTO.Username);
            if (usuario is null)
            {
                return new() { Success = false, Message = "Cancelando." };
            }
            await repository.RemoveOneByUsername(userDTO.Username);
            return new() { Success = true, Message = "Moderador deletado!" };
        }
    }
}
