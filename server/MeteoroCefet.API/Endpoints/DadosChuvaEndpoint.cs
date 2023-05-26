using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Globalization;

namespace MeteoroCefet.API.Endpoints
{
    public class DadosChuvaEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapGet("/dados/chuva", Handler);
        }
        private static async Task<List<ChuvaAcumulada>> Handler([FromServices] DadosTempoRepository repository, [FromServices] EstacaoRepository estacaoRepository)
        {

            var query = await repository.Collection
                .Find(x => x.DataHora.Month >= DateTime.Now.Month)
                .SortBy(x => x.Estacao)
                .ToListAsync();

            var grouped = query.GroupBy(x => x.Estacao).ToList();

            var result = grouped.Select(x => new ChuvaAcumulada
            {
                Id = x.Key,
                Name = estacaoRepository.GetNameByNumber(x.Key),
                LastRead = x.First().DataHora.ToString("t", new CultureInfo("pt-BR")),
                Values = x.Sum(y => y.Precipitacao)
            }).ToList();

            var a = result;

            return result;
        } 
        public class ChuvaAcumulada
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string LastRead { get; set; }
            public double Values { get; set; }

            /*public int FiveMinutes { get; set; }
            public int TenMinutes { get; set; }
            public int ThirtyMinutes { get; set; }
            public int OneHour { get; set; }
            public int ThreeHours { get; set; }
            public int SixHours { get; set; }
            public int TwelveHours { get; set; }
            public int OneDay { get; set; }
            public int OneAndAHalfDays { get; set; }
            public int OneMonth { get; set;}*/
        }
    }
}
