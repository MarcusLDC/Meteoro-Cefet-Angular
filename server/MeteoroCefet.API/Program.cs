using MeteoroCefet.API;
using static BCrypt.Net.BCrypt;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors();
builder.Services.ConfigureMeteoroServices();
builder.Services.AddSingleton<BCrypt.Net.BCrypt>();
builder.Logging.AddConsole();
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