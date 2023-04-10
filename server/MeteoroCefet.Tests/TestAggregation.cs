using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using MongoDB.Driver;

namespace MeteoroCefet.Tests
{
    internal class TestAggregation
    {
        [Test]
        public async Task GetAggregated()
        {
            var client = Utils.MongoClient();
            var repositoryDadosTempo = new DadosTempoRepository(client);

            var latestDataPerStation = await repositoryDadosTempo
                .Collection
                .Aggregate()
                .SortByDescending(d => d.DataHora)
                .Group(d => d.Estacao, g => g.First())
                .ToListAsync();

            Assert.Pass();
        }

        [Test]
        public async Task TestAggregationOperation()
        {
            var client = Utils.MongoClient();
            var repositoryDadosTempo = new DadosTempoRepository(client);

            var now = DateTime.UtcNow;

            var result = await repositoryDadosTempo
                .Collection
                .Aggregate()
                .SortByDescending(d => d.DataHora)
                .Group(d => d.Estacao, g => g.First())
                .ToListAsync();

            var test = result
                .Select(x => new { x.Estacao, ElapsedSinceLastData = now - x.DataHora })
                .Where(x => x.ElapsedSinceLastData > TimeSpan.FromHours(12))
                .ToList();

            Assert.Pass();
        }

        [Test]
        public async Task TestAggregationLookup()
        {
            var client = Utils.MongoClient();
            var repositoryDadosTempo = new DadosTempoRepository(client);
            var repositoryEstacao = new EstacaoRepository(client);

            var now = DateTime.UtcNow;  

            //var result = await repositoryDadosTempo
            //    .Collection
            //    .Aggregate()
            //    .Lookup(
            //    repositoryEstacao.Collection,
            //    d => d.Estacao,
            //    e => e.Numero,
            //    (b,c) => new { })
            //    .Unwind("")
            //    .ToListAsync();

            Assert.Pass();
        }
    }
}