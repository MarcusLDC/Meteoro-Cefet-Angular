namespace MeteoroCefet.Application.Models
{
    public class ConsultaModel
    {
        public DateTime PeriodoInicio { get; set; } = new DateTime();
        public DateTime PeriodoFim { get; set; } = new DateTime();
        public string[] Estacao { get; set; } = Array.Empty<string>();
        public string Intervalo { get; set; } = "";
        public bool TempAr { get; set; } = false;  // Checkboxes
        public bool Tabela { get; set; } = false;
        public bool Grafico { get; set; } = false;
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
}