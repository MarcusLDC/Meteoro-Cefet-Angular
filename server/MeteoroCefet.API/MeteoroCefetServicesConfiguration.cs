using MeteoroCefet.Infra;

namespace MeteoroCefet.API
{
    public static class MeteoroCefetServicesConfiguration
    {
        public static void ConfigureMeteoroServices(this IServiceCollection services)
        {
            services.AddTransient<DadosTempoRepository>();
            services.AddTransient<EstacaoRepository>();
        }
    }
}