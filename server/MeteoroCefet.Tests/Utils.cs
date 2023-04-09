using MongoDB.Driver;

namespace MeteoroCefet.Tests
{
    public class Utils
    {
        public static MongoClient MongoClient() 
        {
            var password = File.ReadAllText("..//..//..//..//.env").Split().Last()["MONGO_PASSWORD=".Length..];
            var connectionString = "mongodb+srv://cefetmeteoro:SENHA@meteorocefetcluster.kvvv7gn.mongodb.net/?retryWrites=true&w=majority".Replace("SENHA", password);
            return new MongoClient(connectionString);
        }
    }
}