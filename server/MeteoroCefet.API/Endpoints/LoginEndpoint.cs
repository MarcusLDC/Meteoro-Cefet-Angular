using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;
using static BCrypt.Net.BCrypt;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;
using System.Security.Cryptography;
using MeteoroCefet.Domain.Entities;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace MeteoroCefet.API.Endpoints
{
    public class LoginEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("/login", Handler);
        }
        private static async Task<AuthorizationDTO> Handler([FromServices] ILogger<ApplicationUser> log, [FromServices] UsersRepository repository, [FromBody] UserInformationDTO userDTO)
        {
            var usuario = await repository.GetByUsername(userDTO.Username);

            if (usuario is null)
            {
                log.LogInformation("Tentativa de login com usuário inválido: {userDTO.Username}", userDTO.Username);

                return new() { Success = false, Message = "Credenciais incorretas"};
            }

            bool acesso = Verify(userDTO.Password, usuario.Password);

            log.LogInformation("Tentativa de login: {userDTO.Username} , Status de acesso: {acesso} ", userDTO.Username, acesso);

            if (acesso)
            {
                return new() { Success = true, Jwt = GenerateToken(usuario.Username)};
            }

            return new() { Success = false, Message = "Credenciais incorretas" };
        }
        private static string GenerateToken(string username)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            var claims = new ClaimsIdentity(new[] {
                new Claim("username", username)
            });

            var key = new SymmetricSecurityKey(new byte[32]);

            using (var generator = new RNGCryptoServiceProvider())
            {
                generator.GetBytes(key.Key);
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = claims,
                Expires = DateTime.UtcNow.AddMinutes(2),
                Issuer = "Comet-Lapa",
                Audience = "MeteoroCefet",
                SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            var newTokenString = tokenHandler.WriteToken(token);

            // var newTokenString = JsonConvert.SerializeObject(token);

            return newTokenString;
        }
    }
}
