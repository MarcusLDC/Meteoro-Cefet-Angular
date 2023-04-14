using MeteoroCefet.Infra.BackgroundServices;

namespace MeteoroCefet.Tests
{
    internal class TaskManagerTests
    {
        [Test]
        public void GetAggregated()
        {
            var tm = new TaskManager();

            var now = DateTime.Now;

            tm.Enqueue(new() { Activity = ct => Task.CompletedTask, ExecutionTime = now });
            tm.Enqueue(new() { Activity = ct => Task.CompletedTask, ExecutionTime = now.AddDays(1) });

            var first = tm.Dequeue();
            Assert.IsTrue(first.ExecutionTime == now);

            var second = tm.Dequeue();
            Assert.IsTrue(second.ExecutionTime > now);
        }
    }
}
