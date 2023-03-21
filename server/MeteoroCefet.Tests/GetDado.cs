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

            var test = await repositoryDadosTempo.GetLast(1,10);

            Assert.Pass();
        }
    }
}