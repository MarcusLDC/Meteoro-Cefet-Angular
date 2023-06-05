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
    }
    public enum Status 
    { 
        Funcionando, 
        Desligada, 
        Manutencao
    }
}