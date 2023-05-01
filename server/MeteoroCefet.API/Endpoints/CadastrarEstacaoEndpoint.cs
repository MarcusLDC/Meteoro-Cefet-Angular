using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace MeteoroCefet.API.Endpoints
{
    public class CadastrarEstacaoEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("estacao/cadastrar", Handler).RequireAuthorization("RequireAdmin");
        }
        private static Guid Handler([FromServices] EstacaoRepository estacaoRepository, [FromServices] ILogger<string> log, [FromBody] CriarEstacaoParams estacaoCadastro)
        {
            var filter = Builders<Estacao>.Filter.Eq("_id", estacaoCadastro. Numero);
            var update = Builders<Estacao>.Update.Set("senha", estacaoCadastro.Senha);

            var estacao = estacaoRepository.Collection.Find(filter).FirstOrDefault();

            if (estacao == null)
            {
                // estação não encontrada
                log.LogInformation($"Estação com id {estacaoCadastro.Numero} não encontrada.");
                return new Guid();
            }

            // verifique se a estação retornada pelo filtro é a mesma que você espera atualizar
            if (estacao.Numero != estacaoCadastro.Numero)
            {
                // o filtro não está pegando a estação correta
                log.LogInformation($"O filtro não está pegando a estação correta. Esperado: {estacaoCadastro.Numero}, encontrado: {estacao.Id}");
                return new Guid();
            }


            log.LogInformation($"Estacao encontrada: {estacao.Nome}, encontrado: {estacao.Id}");

            // estacaoRepository.Collection.UpdateOne(filter, update);
            // log.LogInformation($"Senha atualizada com sucesso para a estação com id {estacaoCadastro.Id}.");

            return new Guid();

        }
        private record CriarEstacaoParams(int Numero, string Senha);
    }
}
