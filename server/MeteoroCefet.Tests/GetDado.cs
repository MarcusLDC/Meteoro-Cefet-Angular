using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MeteoroCefet.Tests
{
    internal class GetDado
    {
        [Test]
        public async Task Test()
        {
            var client = new MongoClient("mongodb+srv://cefetmeteoro:uP9JTsAZU8lZumJ2@meteorocefetcluster.kvvv7gn.mongodb.net/?retryWrites=true&w=majority");
            var repositoryDadosTempo = new DadosTempoRepository(client);

            var test = await repositoryDadosTempo.GetLast(1,10);

            Assert.Pass();
        }
    }
}
