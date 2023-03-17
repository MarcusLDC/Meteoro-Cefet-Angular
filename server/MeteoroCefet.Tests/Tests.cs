using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;

namespace MeteoroCefet.Tests
{
    public class Tests
    {
        [Test]
        public async Task MigrarDados()
        {
            var client = new MongoClient("mongodb+srv://cefetmeteoro:QOgajprRd25ZkB9D@meteorocefetcluster.kvvv7gn.mongodb.net/?retryWrites=true&w=majority");
            var repositoryDadosTempo = new DadosTempoRepository(client);
            var repositoryEstacao = new EstacaoRepository(client);

            var dadosTempoExtraidos = JArray.Parse(File.ReadAllText("..\\..\\..\\tabela.json")).Select(item => new DadosTempo()
            {
                DataHora = DateTime.ParseExact(item["DataHora"].ToString(), "dd/MM/yyyy HH:mm:ss", null),
                Estacao = item["Estacao"].Value<int>(),
                TemperaturaAr = item["Tar"].Value<double>(),
                UmidadeRelativaAr = item["URar"].Value<int>(),
                Pressao = item["Pressao"].Value<double>(),
                RadSolar = item["Rad"].Value<int>(),
                Precipitacao = item["Prec"].Value<double>(),
                DirecaoVento = item["Wd"].Value<int>(),
                VelocidadeVento = item["Ws"].Value<int>(),
                TempPontoOrvalho = item["TPO"].Value<double>(),
                IndiceCalor = item["IC"].Value<double>(),
                DeficitPressaoVapor = item["DPV"].Value<double>(),
                Bateria = item["Bateria"].Value<double>(),
                Extra1 = item["Extra1"].Value<double>(),
                Extra2 = item["Extra2"].Value<double>(),
                Extra3 = item["Extra3"].Value<double>(),
                Extra4 = item["Extra4"].Value<double>(),
                Status = item["Status"].ToString(),
            }).ToList();

            await SalvarEstacoes(repositoryEstacao, dadosTempoExtraidos);

            await repositoryDadosTempo.AddRange(dadosTempoExtraidos);

            Assert.Pass();
        }

        private static async Task SalvarEstacoes(EstacaoRepository repositoryEstacao, List<DadosTempo> saida)
        {
            var estacoes = saida.Select(x => x.Estacao).Distinct();

            foreach (var estacao in estacoes)
            {
                await repositoryEstacao.Add(new Estacao() { Numero = estacao });
            }
        }
    }
}