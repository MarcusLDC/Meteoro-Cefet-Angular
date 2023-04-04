
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
            var updateDefinition = new UpdateDefinitionBuilder<Estacao>().Combine(Builders<Estacao>.Update.Set("Status", Status.Desligada));

            repository.Collection.UpdateMany(_ => true, updateDefinition);

            Assert.Pass();
        }
    }
}
