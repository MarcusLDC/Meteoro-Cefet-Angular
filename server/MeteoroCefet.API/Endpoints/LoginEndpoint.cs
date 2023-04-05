
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using MeteoroCefet.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System.Text;
using System.Security.Claims;

namespace MeteoroCefet.API.Endpoints
{
    public class LoginEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("/login", Handler);
        }
        private static async Task<AuthorizationDTO> Handler([FromServices] ILogger<ApplicationUser> log, [FromServices] UserManager<ApplicationUser> userManager, [FromBody] UserInformationDTO userDTO)
        {
            var usuario = await userManager.FindByNameAsync(userDTO.Username);

            if (usuario is null)
            {
                log.LogInformation("Tentativa de login com usuário inválido: {userDTO.Username}", userDTO.Username);

                return new() { Success = false, Message = "Credenciais incorretas"};
            }

            bool acesso = await userManager.CheckPasswordAsync(usuario, userDTO.Password);

            log.LogInformation("Tentativa de login: {userDTO.Username} , Status de acesso: {acesso} ", userDTO.Username, acesso);

            if (acesso)
            {
                return new() { Success = true, Jwt = await GenerateTokenAsync(userManager, usuario)};
            }

            return new() { Success = false, Message = "Credenciais incorretas" };
        }
        private static async Task<string> GenerateTokenAsync(Microsoft.AspNetCore.Identity.UserManager<ApplicationUser> userManager, ApplicationUser usuario)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, usuario.Username),
                new Claim(JwtRegisteredClaimNames.Jti, usuario.Id.ToString()),
            };

            var userRoles = await userManager.GetRolesAsync(usuario);

            foreach (var role in userRoles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("senhasecretadocefet"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddDays(1);

            var token = new JwtSecurityToken(
                issuer: "Comet-Lapa",
                audience: "MeteoroCefet",
                claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
