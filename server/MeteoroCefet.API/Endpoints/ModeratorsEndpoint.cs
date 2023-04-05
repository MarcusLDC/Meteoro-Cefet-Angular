using MeteoroCefet.Application;
using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Domain.Entities.Identity;
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
        private static async Task<List<string>> Handler([FromServices] IdentityService identityService)
        {
            return await identityService.GetAllModerators();
        }
    }
}
