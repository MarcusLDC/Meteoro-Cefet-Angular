using MeteoroCefet.API;
using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Domain.Entities.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors();
builder.Services.ConfigureMeteoroServices();
builder.Services.AddSingleton<BCrypt.Net.BCrypt>();

builder.Services
.AddIdentity<ApplicationUser, ApplicationRole>()

.AddMongoDbStores<ApplicationUser, ApplicationRole, Guid>
(
    builder.GetConnectionString(), "Identity"
);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "Comet-Lapa",
            ValidAudience = "MeteoroCefet",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("senhasecretadocefet"))
        };
    });

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