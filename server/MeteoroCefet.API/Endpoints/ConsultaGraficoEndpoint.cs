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
            var consulta = await mediator.Send(new ConsultaRequest(model)); // x.SelectMany(x => x)) y.Statistics.ToDictionary(x => consulta.SelectedFields.Select(), y => y.Points));  

            var filterByFields = consulta.StationsData.ToDictionary(
                x => x.Station,
                y => {
                    var SelectedFields = new List<Dictionary<string, List<double>>>();

                    foreach(var field in consulta.SelectedFields)
                    {
                        var dict = new Dictionary<string, List<double>>
                        {
                            { Enum.GetName(field), y.Statistics.Select(x => x.Points.ElementAtOrDefault((int)field)).ToList() }
                        };

                        SelectedFields.Add(dict);
                    }

                    return SelectedFields;
                });           

            return new ConsultaGraficoDto()  // y => y FlatData { DataPoints = y.Statistics.SelectMany(x => x.Points).ToList() }
            {
                Dates = consulta.StationsData.SelectMany(x => x.Statistics.Select(x => x.Date)).ToList(),
                FlatByStation = filterByFields
            };
        }

        public class ConsultaGraficoDto
        {
            public required List<string> Dates { get; set; }
            public required Dictionary<int, List<Dictionary<string, List<double>>>> FlatByStation { get; set; }
        }

    }
}