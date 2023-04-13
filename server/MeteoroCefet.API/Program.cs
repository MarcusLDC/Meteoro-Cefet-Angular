using MeteoroCefet.API;
using MeteoroCefet.Application;
using MeteoroCefet.Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);
builder
    .Services
    .AddIdentity<ApplicationUser, ApplicationRole>()
    .AddMongoDbStores<ApplicationUser, ApplicationRole, Guid>(builder.Configuration.GetMongoConnectionString(), "Identity")
    .AddDefaultTokenProviders();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors();
builder.Services.AddMediatR(x => x.RegisterServicesFromAssemblyContaining(typeof(AssemblyMarker)));
builder.Services.ConfigureMeteoroServices();
builder.Services.ConfigureBackgroundServices();
builder.Services.ConfigureAuthorization(builder.Configuration);
builder.Services.ConfigureMongoClient(builder.Configuration);

builder.Logging.AddConsole();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(b => b.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
app.UseCustomExceptionHandler();
app.UseEndpointDefinitions();

app.UseAuthentication();
app.UseAuthorization();
app.UseGuidRepresentation();

app.Run();