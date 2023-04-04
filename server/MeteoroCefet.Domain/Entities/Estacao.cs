namespace MeteoroCefet.Domain.Entities
{
    public class Estacao : Entity
    {
        public int Numero { get; set; }
        public DateTime DataInicio { get; set; }
        public string Nome { get; set; }
        public decimal Latitude { get; set; } 
        public decimal Longitude { get; set; } 
        public decimal Altitude { get; set; }
        public decimal Altura { get; set; }
        public Status Status { get; set; }
    }
    public enum Status 
    { 
        Funcionando, 
        Desligada, 
        Manutencao
    }

}