
namespace MeteoroCefet.Domain.Entities
{
    public class ApplicationUser : Entity
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
    }
}
