using MeteoroCefet.Infra;
using MongoDB.Driver;
using System.Net.NetworkInformation;

namespace MeteoroCefet.Tests
{
    internal class GetDado
    {
        [Test]
        public async Task Test()
        {
            var repository = new DadosTempoRepository(Utils.MongoClient());

            //await AtualizarEstacoesIniciais(repository);

            //await ApagarTestes(repositoryDadosTempo);

            var ultimos = await repository.Collection.CountDocumentsAsync(x => x.DataHora > new DateTime(2023, 3, 16));

            Assert.Pass();
        }

        private static async Task ApagarTestes(DadosTempoRepository repository)
        {
            var testes = await repository.Collection.Find(x => x.Status == "V99").ToListAsync();

            foreach (var item in testes)
            {
                await repository.Collection.DeleteOneAsync(x => x.Id == item.Id);
            }
        }

        private static async Task AtualizarEstacoesIniciais(DadosTempoRepository dadosRepository)
        {
            var estacaoRepository = new EstacaoRepository(Utils.MongoClient());
            var estacoes = await dadosRepository.Get(_ => true);

        }
    }
}