﻿using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using Microsoft.AspNetCore.Mvc;

namespace MeteoroCefet.API.Endpoints
{
    public class NovoDadoTempoEndpoint : IEndpointDefinition
    {
        public void DefineEndpoints(WebApplication app)
        {
            app.MapPost("dados/new", Handler);
        }
        private static async Task<Guid> Handler([FromServices] DadosTempoRepository repository, [FromServices] ILogger<NovoDadoTempoEndpoint> log, string msg, string key)
        {
            log.LogInformation("Recebi: {msg} {key}", msg, key);

            var pedacinhos = msg.Split(";");

            var DataHora = DateTime.ParseExact(pedacinhos[0].ToString(), "dd/MM/yyyy HH:mm:ss", null);
            var Estacao = int.Parse(pedacinhos[1]);

            double TemperaturaAr = ConverteDouble(pedacinhos[2]);
            int UmidadeRelativaAr = ConverteInt(pedacinhos[3]);
            double Pressao = ConverteDouble(pedacinhos[4]);
            int RadSolar = ConverteInt(pedacinhos[5]);
            double Precipitacao = ConverteDouble(pedacinhos[6]);
            int DirecaoVento = ConverteInt(pedacinhos[7]);
            int VelocidadeVento = ConverteInt(pedacinhos[8]);
            double TempPontoOrvalho = ConverteDouble(pedacinhos[9]);
            double IndiceCalor = ConverteDouble(pedacinhos[10]);
            double DeficitPressaoVapor = ConverteDouble(pedacinhos[11]);
            double Bateria = ConverteDouble(pedacinhos[12]);
            double Extra1 = ConverteDouble(pedacinhos[13]);
            double Extra2 = ConverteDouble(pedacinhos[14]);
            double Extra3 = ConverteDouble(pedacinhos[15]);
            double Extra4 = ConverteDouble(pedacinhos[16]);

            var Status = pedacinhos[17];

            var dado = new DadosTempo
            {
                DataHora = DataHora,
                Estacao = Estacao,
                TemperaturaAr = TemperaturaAr,
                UmidadeRelativaAr = UmidadeRelativaAr,
                Pressao = Pressao,
                RadSolar = RadSolar,
                Precipitacao = Precipitacao,
                DirecaoVento = DirecaoVento,
                VelocidadeVento = VelocidadeVento,
                TempPontoOrvalho = TempPontoOrvalho,
                IndiceCalor = IndiceCalor,
                DeficitPressaoVapor = DeficitPressaoVapor,
                Bateria = Bateria,
                Extra1 = Extra1,
                Extra2 = Extra2,
                Extra3 = Extra3,
                Extra4 = Extra4,
                Status = Status
            };

            return await repository.Add(dado);
        }

        private static double ConverteDouble(string text)
        {
            var resultado = double.Parse(ConverteString(text));
            return double.IsNaN(resultado) ? 0 : resultado;
        }
        private static int ConverteInt(string text)
        {
            var resultado = int.Parse(ConverteString(text));
            return resultado;
        }
        private static string ConverteString(string text)
        {
            return text == "" ? "0" : text;
        }
    }
}