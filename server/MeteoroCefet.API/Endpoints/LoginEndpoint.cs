using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;
using static BCrypt.Net.BCrypt;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;
using System.Security.Cryptography;

namespace MeteoroCefet.API.Endpoints
{
    public class LoginEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("login", Handler);
        }
        private static async Task<string> Handler([FromServices] UsersRepository repository, [FromBody] UserInformationDTO userDTO)
        {
            var usuario = await repository.GetByUsername(userDTO.Username);

            if (usuario != null)
            {
                bool acesso = Verify(userDTO.Password, usuario.Password);

                if (acesso)
                {
                    return GenerateToken(usuario.Username);
                }
                else
                {
                    return "Acesso negado";
                }
            } else {
                return "Acesso negado";
            }
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
                Expires = DateTime.UtcNow.AddMinutes(10),
                Issuer = "Comet-Lapa",
                Audience = "MeteoroCefet",
                SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            var newTokenString = tokenHandler.WriteToken(token);

            return newTokenString;
        }
        
    }
}
