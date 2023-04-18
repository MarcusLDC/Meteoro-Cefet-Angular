using Amazon.Runtime.Internal.Transform;
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

            var filterByFields = consulta.StationsData.Select(x => new StationData
            {
                Station = x.Station,
                Fields = consulta.SelectedFields.Select(y => new FieldData { Field = y, Values = x.Statistics.Select(x => x.Points.ElementAtOrDefault((int)y)).ToList() }).ToList()
            });

            return new ConsultaGraficoDto()
            {
                Dates = consulta.StationsData.First().Statistics.Select(x => x.Date).ToList(),
                StationData = filterByFields.ToList()
            };
        }

        public class ConsultaGraficoDto
        {
            public required List<string> Dates { get; set; }
            public required List<StationData> StationData { get; set; }
        }
        public class StationData 
        { 
            public required int Station { get; set; }
            public required List<FieldData> Fields { get; set; }
        }
        public class FieldData 
        { 
            public required Campo Field { get; set;}
            public required List<double> Values { get; set; }
        }
    }
}