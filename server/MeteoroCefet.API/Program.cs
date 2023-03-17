using MeteoroCefet.API;
using MeteoroCefet.Infra;
using MongoDB.ApplicationInsights.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddMongoClient();
builder.Services.AddTransient<DadosTempoRepository>();
builder.Services.AddCors();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(b => b.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
app.UseCustomExceptionHandler();
app.UseEndpointDefinitions();
app.Run();