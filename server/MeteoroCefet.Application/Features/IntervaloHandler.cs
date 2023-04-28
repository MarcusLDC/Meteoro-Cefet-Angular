namespace MeteoroCefet.Application.Features
{
    public class IntervaloHandler
    {
        public static DateTime FlattenDataRange(DateTime date, string intervalo)
        {
            return intervalo switch
            {
                "1 minuto" => new DateTime(date.Year, date.Month, date.Day, date.Hour, date.Minute / 1 * 1, 0),
                "10 minutos" => new DateTime(date.Year, date.Month, date.Day, date.Hour, date.Minute / 10 * 10, 0),
                "30 minutos" => new DateTime(date.Year, date.Month, date.Day, date.Hour, date.Minute / 30 * 30, 0),
                "1 hora" => new DateTime(date.Year, date.Month, date.Day, date.Hour, 0, 0),
                "24 horas" => new DateTime(date.Year, date.Month, date.Day, 0, 0, 0),
                "Mensal" => new DateTime(date.Year, date.Month, 1, 0, 0, 0),
                _ => throw new ArgumentException("Intervalo inválido"),
            };
        }
    }
}