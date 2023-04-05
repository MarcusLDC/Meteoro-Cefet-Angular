using MeteoroCefet.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;


namespace MeteoroCefet.API.Endpoints
{
    public class ModeratorsEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapGet("/moderadores", Handler);
        }
        private static async Task<List<ApplicationUser>> Handler([FromServices] UserManager<ApplicationUser> userManager)
        {
            return await userManager.Users.Where(x => x.Roles.Intersect(x.Roles).Any()).ToListAsync();
        }
    }
}
