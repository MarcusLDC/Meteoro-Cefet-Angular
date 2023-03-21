using MeteoroCefet.Infra;
using MongoDB.Driver;

namespace MeteoroCefet.Tests
{
    internal class GetDado
    {
        [Test]
        public async Task Test()
        {
            var client = new MongoClient("mongodb+srv://cefetmeteoro:SENHA@meteorocefetcluster.kvvv7gn.mongodb.net/?retryWrites=true&w=majority");
            var repositoryDadosTempo = new DadosTempoRepository(client);

            var testes = await repositoryDadosTempo.Collection.Find(x => x.Status == "V99").ToListAsync();

            foreach (var item in testes)
            {
                await repositoryDadosTempo.Collection.DeleteOneAsync(x => x.Id == item.Id);
            }

            var ultimos = await repositoryDadosTempo.Collection.Count(x => x.DataHora > DateTime.Now.AddDays(-3)).ToListAsync();

            Assert.Pass();
        }
    }
}