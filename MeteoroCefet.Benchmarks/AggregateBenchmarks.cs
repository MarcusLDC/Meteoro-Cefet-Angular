using BenchmarkDotNet.Attributes;
using BenchmarkDotNet.Order;
using MeteoroCefet.Infra;
using MeteoroCefet.Tests;
using MongoDB.Driver;

[MemoryDiagnoser]
[Orderer(SummaryOrderPolicy.FastestToSlowest)]
[RankColumn]
public class AggregateBenchmarks
{
    private static readonly IMongoClient client = Utils.MongoClient();
    private static readonly DadosTempoRepository dadosTempoRepository = new(client);

    [Benchmark]
    public async Task GetLatestPerStation()
    {
        await dadosTempoRepository
                .Collection
                .Aggregate()
                .SortByDescending(d => d.DataHora)
                .Group(d => d.Estacao, g => g.First())
                .ToListAsync();
    }

    [Benchmark]
    public async Task GetCountPerStation()
    {
        await dadosTempoRepository
                .Collection
                .Aggregate()
                .SortByDescending(d => d.DataHora)
                .Group(d => d.Estacao, g => g.Count())
                .ToListAsync();
    }
}