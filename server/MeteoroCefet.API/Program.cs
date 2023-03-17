using MeteoroCefet.API;
using MeteoroCefet.Infra;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddTransient<DadosTempoRepository>();
builder.Services.AddCors();
builder.ConfigureMongoClient();

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