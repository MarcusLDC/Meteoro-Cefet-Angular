using MeteoroCefet.Infra;
using MongoDB.Driver;

namespace MeteoroCefet.Tests
{
    internal class GetDado
    {
        [Test]
        public async Task Test()
        {
            var password = File.ReadAllText("..//..//..//..//.env").Split().Last()["MONGO_PASSWORD=".Length..];
            var connectionString = "mongodb+srv://cefetmeteoro:SENHA@meteorocefetcluster.kvvv7gn.mongodb.net/?retryWrites=true&w=majority".Replace("SENHA", password);
            var client = new MongoClient();
            var repositoryDadosTempo = new DadosTempoRepository(client);

            //await ApagarTestes(repositoryDadosTempo);

            var ultimos = await repositoryDadosTempo.Collection.CountDocumentsAsync(x => x.DataHora > new DateTime(2023, 3, 16));

            Assert.Pass();
        }

        private static async Task ApagarTestes(DadosTempoRepository repositoryDadosTempo)
        {
            var testes = await repositoryDadosTempo.Collection.Find(x => x.Status == "V99").ToListAsync();

            foreach (var item in testes)
            {
                await repositoryDadosTempo.Collection.DeleteOneAsync(x => x.Id == item.Id);
            }
        }
    }
}