using MeteoroCefet.Application;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using MongoDB.ApplicationInsights.DependencyInjection;
using MongoDB.Bson;
using Newtonsoft.Json;
using System.Reflection;
using System.Text;

namespace MeteoroCefet.API
{
    public static class ProgramExtensions
    {
        public static void ConfigureMongoClient(this IServiceCollection services, IConfiguration configuration)
        {
            string connectionStringWithSecrets = GetMongoConnectionString(configuration);

            services.AddMongoClient(connectionStringWithSecrets);
        }

        public static string GetMongoConnectionString(this IConfiguration configuration)
        {
            var mongoPassword = Environment.GetEnvironmentVariable("MONGO_PASSWORD") ??
                throw new Exception("Environment Variable MONGO_PASSWORD not defined");

            var mongoUser = Environment.GetEnvironmentVariable("MONGO_USER") ??
                throw new Exception("Environment Variable MONGO_USER not defined");

            var connectionString = configuration.GetConnectionString("MongoDb") ??
                throw new Exception("MongoDb ConnectionString not defined in appsettings");

            var connectionStringWithSecrets = connectionString
                .Replace("MONGO_PASSWORD", mongoPassword)
                .Replace("MONGO_USER", mongoUser);

            return connectionStringWithSecrets;
        }

        public static void UseCustomExceptionHandler(this WebApplication app)
        {
            app.UseExceptionHandler(exceptionHandlerApp =>
            {
                exceptionHandlerApp.Run(async context =>
                {
                    context.Response.StatusCode = StatusCodes.Status500InternalServerError;

                    context.Response.ContentType = System.Net.Mime.MediaTypeNames.Application.Json;

                    var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>()!;

                    var json = JsonConvert.SerializeObject(exceptionHandlerPathFeature.Error, Formatting.Indented);

                    await context.Response.WriteAsync(json);
                });
            });
        }

        public static void UseEndpointDefinitions(this WebApplication app)
        {
            var definitions = GetEndpointsTypes().Select(Activator.CreateInstance).Cast<IEndpointDefinition>();

            foreach (var endpointDefinition in definitions)
            {
                endpointDefinition.DefineEndpoints(app);
            }
        }

        private static IEnumerable<Type> GetEndpointsTypes()
        {
            var types = Assembly.GetEntryAssembly()!.ExportedTypes;
            return types.Where(t => typeof(IEndpointDefinition).IsAssignableFrom(t) && !t.IsInterface);
        }

        public static void UseGuidRepresentation(this WebApplication app)
        {
            BsonDefaults.GuidRepresentation = GuidRepresentation.CSharpLegacy;
        }

        public static void ConfigureAuthorization(this IServiceCollection services, IConfiguration configuration)
        {
            var jwtAppSettingOptions = configuration.GetSection(nameof(JwtOptions));

            var securityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(configuration.GetSection("JwtOptions:SecurityKey").Value));

            services.Configure<JwtOptions>(options =>
            {
                options.Issuer = jwtAppSettingOptions[nameof(JwtOptions.Issuer)];
                options.Audience = jwtAppSettingOptions[nameof(JwtOptions.Audience)];
                options.SigningCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha512);
                options.Expiration = int.Parse(jwtAppSettingOptions[nameof(JwtOptions.Expiration)] ?? "0");
            });

            services.Configure<IdentityOptions>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
                options.Password.RequiredLength = 4;
            });

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = configuration.GetSection("JwtOptions:Issuer").Value,

                ValidateAudience = true,
                ValidAudience = configuration.GetSection("JwtOptions:Audience").Value,

                ValidateIssuerSigningKey = true,
                IssuerSigningKey = securityKey,

                RequireExpirationTime = true,
                ValidateLifetime = true,

                ClockSkew = TimeSpan.Zero
            };

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = tokenValidationParameters;
            });

            services.AddAuthorization(options =>
            {
                options.AddPolicy("RequireAdmin", policy => policy.RequireRole("Admin"));
                options.AddPolicy("RequireModerator", policy => policy.RequireRole("Moderator"));

                options.AddPolicy("RequireAdminOrModerator", policy => policy.RequireRole("Admin", "Moderator"));
            });

            services.AddTransient<IdentityService>();
        }
    }

    public interface IEndpointDefinition
    {
        void DefineEndpoints(WebApplication app);
    }
}