using MeteoroCefet.API;
using MeteoroCefet.API.Endpoints;
using MeteoroCefet.Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace MeteoroCefet.Application
{
    public record UserRegisterRequest(string Username, string Password, List<string> Roles);
    public record UserRegisterResponse(bool Success, IEnumerable<string>? Errors);
    public record UserLoginRequest(string Username, string Password);
    public record UserLoginResponse(bool Success, string? Token);

    public class IdentityService
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly JwtOptions _jwtOptions;

        public IdentityService(SignInManager<ApplicationUser> signInManager,
                               UserManager<ApplicationUser> userManager,
                               RoleManager<ApplicationRole> roleManager,
                               IOptions<JwtOptions> jwtOptions)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _roleManager = roleManager;
            _jwtOptions = jwtOptions.Value;
        }

        public async Task<UserRegisterResponse> RegisterUser(UserRegisterRequest request)
        {
            var user = new ApplicationUser
            {
                UserName = request.Username
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (result.Succeeded)
            {
                await GarantirRolesCriadas(request);

                await _userManager.AddToRolesAsync(user, request.Roles);
                await _userManager.SetLockoutEnabledAsync(user, false);
            }

            var errors = result.Errors.Select(x => x.Description);

            return new UserRegisterResponse(result.Succeeded, errors);
        }

        private async Task GarantirRolesCriadas(UserRegisterRequest request)
        {
            var statusRoles = request.Roles.Select(r => new { existe = _roleManager.RoleExistsAsync(r), nome = r });

            await Task.WhenAll(statusRoles.Select(e => e.existe));

            var rolesNaoExistentes = statusRoles.Where(r => r.existe.Result == false);

            var tarefasCriarRoleNaoExistente = rolesNaoExistentes.Select(r => _roleManager.CreateAsync(new ApplicationRole()
            {
                Name = r.nome
            }));

            await Task.WhenAll(tarefasCriarRoleNaoExistente);
        }

        public async Task<Response<IdentityResult>> DeleteUser(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);

            if (user is null)
            {
                return new() { Message = "Usuário não existe", Success = false };
            }

            var result = await _userManager.DeleteAsync(user);

            return new() { Data = result, Message = result.ToString(), Success = result.Succeeded };
        }

        public async Task<UserLoginResponse> Login(UserLoginRequest loginRequest)
        {
            var user = await _userManager.FindByNameAsync(loginRequest.Username);

            if (user is null)
            {
                return new UserLoginResponse(false, null);
            }

            var result = await _signInManager.PasswordSignInAsync(user, loginRequest.Password, false, true);

            if (result.Succeeded)
            {
                return await GenerateToken(user);
            }

            var response = new UserLoginResponse(result.Succeeded, null);

            return response;
        }

        private async Task<UserLoginResponse> GenerateToken(ApplicationUser user)
        {
            var tokenClaims = await ObterClaims(user);
            var now = DateTime.UtcNow;
            var expireDate = now.AddSeconds(_jwtOptions.Expiration);

            var jwt = new JwtSecurityToken(
                issuer: _jwtOptions.Issuer,
                audience: _jwtOptions.Audience,
                claims: tokenClaims,
                notBefore: now,
                expires: expireDate,
                signingCredentials: _jwtOptions.SigningCredentials);

            var token = new JwtSecurityTokenHandler().WriteToken(jwt);

            var response = new UserLoginResponse(true, token);

            return response;
        }

        private async Task<IEnumerable<Claim>> ObterClaims(ApplicationUser user)
        {
            var claims = await _userManager.GetClaimsAsync(user);

            var roles = await _userManager.GetRolesAsync(user);

            var now = DateTime.UtcNow.ToString();
            claims.Add(new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()));
            claims.Add(new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()));
            claims.Add(new Claim(JwtRegisteredClaimNames.Nbf, now));
            claims.Add(new Claim(JwtRegisteredClaimNames.Iat, now));

            foreach (var role in roles)
            {
                claims.Add(new Claim("role", role));
            }

            return claims;
        }

        public async Task<List<string>> GetAllModerators()
        {
            var moderators = await _userManager.GetUsersInRoleAsync("Moderator");
            return moderators.Select(x => x.UserName!).ToList();
        }
    }
}