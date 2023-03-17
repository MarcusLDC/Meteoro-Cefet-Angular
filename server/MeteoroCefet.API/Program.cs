using MeteoroCefet.Application.Models;
using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;
using MongoDB.ApplicationInsights.DependencyInjection;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddMongoClient("mongodb+srv://cefetmeteoro:tnvQN4bZT5dpDPhH@meteorocefetcluster.kvvv7gn.mongodb.net/?retryWrites=true&w=majority");
builder.Services.AddTransient<DadosTempoRepository>();
builder.Services.AddCors();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(b => b.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
app.MapPost("/consulta", Handler);
app.MapPost("/dados", Handler2);
app.Run();

static async Task<List<DadosTempo>> Handler(DadosTempoRepository repository, ConsultaModel model)
{
    return await repository.Get((x) => x.Pressao > 0);
}
static async Task<List<DadosTempo>> Handler2(DadosTempoRepository repository, [FromBody]int numPagina)
{
    return await repository.GetPaginated(numPagina, 1000);
}