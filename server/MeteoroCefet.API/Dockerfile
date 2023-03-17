#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["MeteoroCefet.API/MeteoroCefet.API.csproj", "MeteoroCefet.API/"]
COPY ["MeteoroCefet.Application/MeteoroCefet.Application.csproj", "MeteoroCefet.Application/"]
COPY ["MeteoroCefet.Domain/MeteoroCefet.Domain.csproj", "MeteoroCefet.Domain/"]
COPY ["MeteoroCefet.Infra/MeteoroCefet.Infra.csproj", "MeteoroCefet.Infra/"]
RUN dotnet restore "MeteoroCefet.API/MeteoroCefet.API.csproj"
COPY . .
WORKDIR "/src/MeteoroCefet.API"
RUN dotnet build "MeteoroCefet.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MeteoroCefet.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MeteoroCefet.API.dll"]