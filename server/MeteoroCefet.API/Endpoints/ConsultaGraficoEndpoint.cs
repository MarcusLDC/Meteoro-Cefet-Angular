using MediatR;
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
        private static async Task<ConsultaGraficoDto> Handler(IMediator mediator, [FromBody] ConsultaModel model)
        {
            var consulta = await mediator.Send(new ConsultaRequest(model));

            var c = consulta.StationsData.Select(x => x.Statistics.Select(y => consulta.SelectedFields.Zip(y.Points.Select(x => x))));


            return new ConsultaGraficoDto()
            {
                SelectedFields = consulta.SelectedFields,
            };
        }

        public class ConsultaGraficoDto
        {
            public required List<Campo> SelectedFields { get; set; }
            public required Dictionary<int, FlatData> FlatByStation { get; set; }
        }

        public class FlatData
        {
            public required List<double> DataPoints { get; set; }
        }
    }
}