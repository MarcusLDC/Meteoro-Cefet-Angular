namespace MeteoroCefet.Domain.Entities
{
    public class DadosTempo : Entity
    {
        public DateTime DataHora { get; set; }

        public int Estacao { get; set; }

        public double TemperaturaAr { get; set; }

        public int UmidadeRelativaAr { get; set; }

        public double Pressao { get; set; }

        public int RadSolar { get; set; }

        public double Precipitacao { get; set; }

        public int DirecaoVento { get; set; }

        public int VelocidadeVento { get; set; }

        public double TempPontoOrvalho { get; set; }

        public double IndiceCalor { get; set; }

        public double DeficitPressaoVapor { get; set; }

        public double Bateria { get; set; }

        public double Extra1 { get; set; }
        public double Extra2 { get; set; }
        public double Extra3 { get; set; }
        public double Extra4 { get; set; }

        public string? Status { get; set; }
    }
}



