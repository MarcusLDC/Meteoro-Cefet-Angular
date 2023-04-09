using MeteoroCefet.Infra;
using MeteoroCefet.Infra.BackgroundServices;

namespace MeteoroCefet.API
{
    public static class MeteoroCefetServicesConfiguration
    {
        public static void ConfigureMeteoroServices(this IServiceCollection services)
        {
            services.AddTransient<DadosTempoRepository>();
            services.AddTransient<EstacaoRepository>();

            services.AddSingleton<ShutdownStationsBackgroundService>();
        }

        public static void ConfigureBackgroundServices(this IServiceCollection services)
        {
            services.AddHostedService<ShutdownStationsBackgroundService>();
        }
    }
}