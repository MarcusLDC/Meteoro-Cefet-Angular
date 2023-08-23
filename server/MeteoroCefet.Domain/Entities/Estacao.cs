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
    }
    public enum Status 
    { 
        Funcionando, 
        Desligada, 
        Manutencao
    }
}