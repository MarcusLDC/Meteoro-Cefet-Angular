using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using System.Globalization;

namespace MeteoroCefet.API.Endpoints
{
    public class DadosChuvaEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("/dados/chuva", Handler);
        }
        private static async Task<List<ChuvaAcumuladaDTO>> Handler([FromServices] DadosTempoRepository repository, [FromServices] EstacaoRepository estacaoRepository, 
            [FromBody] ChuvaParams p)
        {

            var query = await repository.Collection
                .Find(x => x.DataHora >= DateTime.Now.AddMinutes(-p.Minutos) && (p.Minutos <= 2880 || x.DataHora.Month == DateTime.Today.Month))
                .SortBy(x => x.Estacao)
                .ToListAsync();

            if (!p.NumeroEstacao.IsNullOrEmpty())
            {
                query = query.Where(x => p.NumeroEstacao.Contains(x.Estacao)).ToList();
            }

            var grouped = query.GroupBy(x => x.Estacao).ToList();

            var result = grouped.Select(x => new ChuvaAcumuladaDTO
            {
                Id = x.Key,
                LastRead = x.First().DataHora.AddHours(-3).ToString("t", new CultureInfo("pt-BR")) + "h - " + x.First().DataHora.AddHours(-3).ToString("d", new CultureInfo("pt-BR")),
                Value = Math.Round(x.Select(y => y.Precipitacao).DefaultIfEmpty(0).Sum(), 1)
            }).ToList();

            return result;
        }

        public class ChuvaAcumuladaDTO
        {
            public int Id { get; set; }
            public string LastRead { get; set; }
            public double Value { get; set; }
        }

        private record ChuvaParams(List<int> NumeroEstacao, int Minutos);
    }
}
