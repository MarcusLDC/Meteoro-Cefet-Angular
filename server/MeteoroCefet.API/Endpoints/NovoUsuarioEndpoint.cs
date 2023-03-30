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
        private static async Task<Guid> Handler([FromServices] UsersRepository repository, string username, string password, string role)
        {
            ApplicationUser user = new ApplicationUser
            {
                Id = Guid.NewGuid(),
                Username = username,
                Password = HashPassword(password),
                Role = role
            };
            return await repository.Add(user);
        }
    }
}
