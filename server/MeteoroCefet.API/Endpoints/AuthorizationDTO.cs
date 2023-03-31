namespace MeteoroCefet.API.Endpoints
{
    public class AuthorizationDTO
    {
        public bool Success { get; set; }
        public string Jwt { get; set; }
        public string Message { get; set; }
    }
}
