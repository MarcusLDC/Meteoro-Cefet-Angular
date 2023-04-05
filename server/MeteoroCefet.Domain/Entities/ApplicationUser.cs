
using AspNetCore.Identity.MongoDbCore.Models;
using MongoDbGenericRepository.Attributes;

namespace MeteoroCefet.Domain.Entities.Identity
{
    [CollectionName("Users")]
    public class ApplicationUser : MongoIdentityUser<Guid>
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
