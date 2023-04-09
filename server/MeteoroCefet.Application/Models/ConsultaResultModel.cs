
namespace MeteoroCefet.Application.Models
{
    public class ConsultaResultModel
    {
        public DateTime DataHora { get; set; }
        public double Estacao { get; set; }
        public double TempAr { get; set; }
        public double TempMin { get; set; }
        public double TempMax { get; set; }
        public double TempOrv { get; set; }
        public double Chuva { get; set; }
        public double DirecaoVento { get; set; } 
        public double VelocidadeVento { get; set; }
        public double VelocidadeVentoMax { get; set; }
        public double Bateria { get; set; }
        public double Radiacao { get; set; }
        public double PressaoATM { get; set; }
        public double IndiceCalor { get; set; }
        public double UmidadeRelativa { get; set; }
    }
}
