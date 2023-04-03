using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace MeteoroCefet.API.Endpoints
{
    public class ModeratorsEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapGet("/moderadores", Handler);
        }
        private static async Task<List<ApplicationUser>> Handler([FromServices] UsersRepository repository)
        {
            return await repository.Collection.Find(x => x.Role == "Moderador").ToListAsync();
        }
    }
}
