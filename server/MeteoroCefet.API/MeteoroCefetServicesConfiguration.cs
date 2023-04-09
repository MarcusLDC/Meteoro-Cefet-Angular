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

            services.AddHostedService<ShutdownStationsBackgroundService>();
            services.AddSingleton<ShutdownStationsBackgroundService>();
        }
    }
}