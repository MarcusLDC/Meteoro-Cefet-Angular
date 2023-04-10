
using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using MongoDB.Driver;


namespace MeteoroCefet.Tests
{
    internal class AlterarDados
    {
        [Test]
        public async Task Test()
        {
            var repository = new EstacaoRepository(Utils.MongoClient());

            repository.Collection.UpdateMany(_ => true, Builders<Estacao>.Update.Set(x => x.Status, Status.Desligada));

            Assert.Pass();
        }
    }
}
