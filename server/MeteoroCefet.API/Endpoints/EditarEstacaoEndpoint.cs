﻿using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;

namespace MeteoroCefet.API.Endpoints
{
    public class EditarEstacaoEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("/estacoesEditar", Handler).RequireAuthorization("RequireAdminOrModerator");
        }
        private static async void Handler([FromServices] ILogger<EditarEstacaoEndpoint> log, [FromServices] EstacaoRepository repository, [FromBody] Estacao estacao)
        {
            estacao.UltimaModificacao = DateTime.Now;
            await repository.ReplaceEstacao(estacao.Numero, estacao);
        }
    }
}