using MeteoroCefet.Infra;

namespace MeteoroCefet.API
{
    public static class MeteoroCefetServicesConfiguration
    {
        public static void ConfigurePrismaticServices(this IServiceCollection services)
        {
            services.AddTransient<DadosTempoRepository>();
        }
    }
}