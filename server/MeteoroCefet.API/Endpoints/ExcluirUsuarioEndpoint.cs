using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;

namespace MeteoroCefet.API.Endpoints
{
    public class ExcluirUsuarioEndpoint
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("usuario/delete", Handler);
        }
        private static async Task<NewUserDTO> Handler([FromServices] UsersRepository repository, [FromBody] UserInformationDTO userDTO)
        {
            var usuario = await repository.GetByUsername(userDTO.Username);
            if (usuario.Role != "Admin")
            {
                
                return new() { Success = true, Message = "Moderador deletado!" };
            }
            return new() { Success = false, Message = "Cancelando." };
        }
    }
}
