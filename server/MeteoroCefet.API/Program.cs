using MeteoroCefet.Application.Models;
using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using MongoDB.ApplicationInsights.DependencyInjection;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddMongoClient("mongodb+srv://cefetmeteoro:mzRD22hsnYSQhY7P@meteorocefetcluster.kvvv7gn.mongodb.net/?retryWrites=true&w=majority");
builder.Services.AddTransient<DadosTempoRepository>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapPost("/consulta", Handler);
app.Run();

async Task<List<DadosTempo>> Handler(DadosTempoRepository repository, ConsultaModel model)
{
    return await repository.Get((x) => x.Pressao > 0);
}