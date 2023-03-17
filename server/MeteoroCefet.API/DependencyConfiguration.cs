using Microsoft.AspNetCore.Diagnostics;
using MongoDB.ApplicationInsights.DependencyInjection;
using System.Reflection;
using System.Xml;
using JsonConvert = Newtonsoft.Json.JsonConvert;

namespace MeteoroCefet.API
{
    public class DependencyConfiguration
    {

    }

    public interface IEndpointDefinition
    {
        void DefineEndpoints(WebApplication app);
    }

    public static class EndpointDefinitonExtensions
    {
        public static void ConfigureMongoClient(this WebApplicationBuilder builder)
        {
            var mongoPassword = Environment.GetEnvironmentVariable("MONGO_PASSWORD") ??
                throw new Exception("Environment Variable MONGO_PASSWORD not defined");

            var mongoUser = Environment.GetEnvironmentVariable("MONGO_USER") ??
                throw new Exception("Environment Variable MONGO_USER not defined");

            var connectionString = builder.Configuration.GetConnectionString("MongoDb") ??
                throw new Exception("MongoDb ConnectionString not defined in appsettings");

            var connectionStringWithSecrets = connectionString
                .Replace("MONGO_PASSWORD", mongoPassword)
                .Replace("MONGO_USER", mongoUser);

            builder.Services.AddMongoClient(connectionStringWithSecrets);
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
    }
}
