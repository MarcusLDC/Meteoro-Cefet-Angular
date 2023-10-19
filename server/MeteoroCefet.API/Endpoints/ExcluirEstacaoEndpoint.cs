using MeteoroCefet.Application;
using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace MeteoroCefet.API.Endpoints
{
    public class ExcluirEstacaoEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("estacao/delete", Handler)//.RequireAuthorization("RequireAdmin")
                                                  ;
        }

        private static async Task<ExcluirEstacaoDTO> Handler([FromServices] ILogger<ExcluirEstacaoEndpoint> log, EstacaoRepository estacaoRepository, DadosTempoRepository dadosTempoRepository, [FromBody] ExcluirEstacaoParams p)
        {

            var estacao = await estacaoRepository.Collection.Find(x => x.Numero == p.Numero).FirstOrDefaultAsync();
            var excluir = new ExcluirEstacaoDTO();

            if (estacao is null)
            {
                log.LogInformation("Tentativa de exclusão: Estacao {estacao} não existe", p.Numero);
                return excluir;
            }

            excluir.Exists = true;

            if(estacao.Senha != p.Senha)
            {
                log.LogInformation("Tentativa de exclusão: Senha incorreta");
                return excluir;
            }

            excluir.Senha = true;

            excluir.Sucess = await estacaoRepository.DeleteStation(p.Numero) && await dadosTempoRepository.DeleteDataByStation(p.Numero);

            log.LogInformation("Tentativa de exclusão da estacao {estacao}, resultado : {resultado}", p.Numero, excluir.Sucess);

            return excluir;
        }
        private record ExcluirEstacaoParams(int Numero, string Senha);
        public class ExcluirEstacaoDTO
        {
            public bool Exists { get; set; } = false;
            public bool Senha { get; set; } = false;
            public bool Sucess { get; set; } = false;
        }
    }
}
