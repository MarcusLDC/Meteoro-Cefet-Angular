using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages.Infrastructure;
using MongoDB.Driver;
using static BCrypt.Net.BCrypt;

namespace MeteoroCefet.API.Endpoints
{
    public class NovoUsuarioEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("usuario/new", Handler);
        }
        private static async Task<NewUserDTO> Handler([FromServices] UsersRepository repository, [FromBody] UserInformationDTO userDTO)
        {
            var usuario = await repository.GetByUsername(userDTO.Username);
            if (usuario is null)
            {
                ApplicationUser user = new ApplicationUser
                {
                    Id = Guid.NewGuid(),
                    Username = userDTO.Username,
                    Password = HashPassword(userDTO.Password),
                    Role = "Moderador"
                };
                await repository.Add(user);
                return new() { Success = true, Message = "Moderador criado com sucesso!"};
            }
            return new() { Success = false, Message = "Nome de usuário já existe, cancelando." };
        }
    }
}
