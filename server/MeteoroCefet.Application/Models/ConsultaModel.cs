﻿namespace MeteoroCefet.Application.Models
{
    public class ConsultaModel
    {
        public DateTime PeriodoInicio { get; set; } = new DateTime();
        public DateTime PeriodoFim { get; set; } = new DateTime();
        public int[] Estacao { get; set; } = Array.Empty<int>();
        public string Intervalo { get; set; } = "";
        public bool TempAr { get; set; } = false;  // Checkboxes
        public bool TempMin { get; set; } = false;
        public bool TempMax { get; set; } = false;
        public bool TempOrv { get; set; } = false;
        public bool Chuva { get; set; } = false;
        public bool DirecaoVento { get; set; } = false;
        public bool VelocidadeVento { get; set; } = false;
        public bool VelocidadeVentoMax { get; set; } = false;
        public bool Bateria { get; set; } = false;
        public bool Radiacao { get; set; } = false;
        public bool PressaoATM { get; set; } = false;
        public bool IndiceCalor { get; set; } = false;
        public bool UmidadeRelativa { get; set; } = false; // Fim-Checkboxes
    }

    public enum Campo
    {
        TempAr,
        TempMin,
        TempMax,
        TempOrv,
        Chuva,
        DirecaoVento,
        VelocidadeVento,
        VelocidadeVentoMax,
        Bateria,
        Radiacao,
        PressaoATM,
        IndiceCalor,
        UmidadeRelativa
    }
}