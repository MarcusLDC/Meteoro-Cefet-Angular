﻿using MediatR;
using MeteoroCefet.Application.Features;
using MeteoroCefet.Application.Models;
using Microsoft.AspNetCore.Mvc;

namespace MeteoroCefet.API.Endpoints
{
    public class ConsultaGraficoEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("/consulta/grafico", Handler);
        }
        private static async Task<IEnumerable<Dictionary<int, ConsultaDTO>>> Handler(IMediator mediator , [FromBody] ConsultaModel model)
        {
            return await mediator.Send(new ConsultaRequest(model));
        }
    }
}
