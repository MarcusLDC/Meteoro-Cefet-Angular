namespace MeteoroCefet.Domain.Entities
{
    public class Estacao : Entity
    {
        public int Numero { get; set; }
        public string Senha { get; set; }
        public DateTime DataInicio { get; set; }
        public DateTime DataFim { get; set; } // new
        public string Nome { get; set; } = "Estação_Nova";
        public decimal Latitude { get; set; } 
        public decimal Longitude { get; set; } 
        public decimal Altitude { get; set; }
        public decimal Altura { get; set; }
        public Status Status { get; set; }
        public DateTime UltimaModificacao { get; set; }  
        public string Operador { get; set; } // new 
        public string Modelo { get; set; } // new
        public string TiposDeSensores { get; set; } // new
        public DateTime UltimaCalibracao { get; set; } // new
        public string ExtraNome1 { get; set; } = "Extra1";
        public string ExtraNome2 { get; set; } = "Extra2";
        public string ExtraNome3 { get; set; } = "Extra3";
        public string ExtraNome4 { get; set; } = "Extra4";
        public string ExtraNome5 { get; set; } = "Extra5";
        public string ExtraNome6 { get; set; } = "Extra6";

        public int TempMin { get; set; }
        public int TempMax { get; set; }
        public int UmidadeMin { get; set; }
        public int UmidadeMax { get; set; }
        public int IndiceCalorMin { get; set; }
        public int IndiceCalorMax { get; set; }
        public int PontoOrvalhoMin { get; set; }
        public int PontoOrvalhoMax { get; set; }
        public int PressaoMin { get; set; }
        public int PressaoMax { get; set; }
        public int ChuvaMin { get; set; }
        public int ChuvaMax { get; set; }
        public int DirecaoVentoMin { get; set; }
        public int DirecaoVentoMax { get; set; }
        public int VelocidadeVentoMin { get; set; }
        public int VelocidadeVentoMax { get; set; }
        public int DeficitPressaoVaporMin { get; set; }
        public int DeficitPressaoVaporMax { get; set; }

        public int Extra1Min { get; set; }
        public int Extra1Max { get; set; }
        public int Extra2Min { get; set; }
        public int Extra2Max { get; set; }
        public int Extra3Min { get; set; }
        public int Extra3Max { get; set; }
        public int Extra4Min { get; set; }
        public int Extra4Max { get; set; }
        public int Extra5Min { get; set; }
        public int Extra5Max { get; set; }
        public int Extra6Min { get; set; }
        public int Extra6Max { get; set; }

        public int RadiacaoSolarMin { get; set; }
        public int RadiacaoSolarMax { get; set; }
        public int BateriaMin { get; set; }
        public int BateriaMax { get; set; }
    } 
    public enum Status 
    { 
        Funcionando, 
        Desligada, 
        Manutencao
    }
}