using MeteoroCefet.Domain.Entities;
using MeteoroCefet.Infra;
using MongoDB.Driver;

namespace MeteoroCefet.API.BackgroundServices
{
    public class ShutdownStationsBackgroundService : BackgroundService
    {
        private static TimeSpan SHUTDOWN_TIMEOUT = TimeSpan.FromHours(12);
        private readonly ILogger<ShutdownStationsBackgroundService> _log;
        private readonly DadosTempoRepository _dadosRepository;
        private readonly EstacaoRepository _estacaoRepository;
        private readonly TaskManager _taskManager;

        public ShutdownStationsBackgroundService(ILogger<ShutdownStationsBackgroundService> log, DadosTempoRepository dadosRepository, EstacaoRepository estacaoRepository)
        {
            _taskManager = new();
            _log = log;
            _dadosRepository = dadosRepository;
            _estacaoRepository = estacaoRepository;
        }

        protected override async Task ExecuteAsync(CancellationToken ct)
        {
            await SetupInitialTasks(ct);

            while (_taskManager.Any())
            {
                var task = _taskManager.Dequeue();
                var delay = task.ExecutionTime - DateTime.Now;

                if (delay.TotalSeconds > 1)
                {
                    await Task.Delay(delay, ct);
                }

                await task.Activity(ct);
            }
        }

        private async Task SetupInitialTasks(CancellationToken ct)
        {
            var now = DateTime.UtcNow;

            var latestPerStation = await _dadosRepository
                .Collection
                .Aggregate()
                .SortByDescending(d => d.DataHora)
                .Group(d => d.Estacao, g => g.First())
                .ToListAsync(ct);

            foreach (var latestFromStation in latestPerStation)
            {
                var timeoutTime = latestFromStation.DataHora + SHUTDOWN_TIMEOUT;
                _taskManager.Enqueue(new()
                {
                    ExecutionTime = timeoutTime,
                    Activity = async (CancellationToken ct) => await VerifyStationIn(latestFromStation.Estacao, timeoutTime)
                });
            }
        }

        public void ScheduleStationShutdown(int stationNumber)
        {
            ScheduleStationShutdownIn(stationNumber, DateTime.UtcNow);
        }

        private void ScheduleStationShutdownIn(int stationNumber, DateTime time)
        {
            var scheduled = time + SHUTDOWN_TIMEOUT;

            _taskManager.Enqueue(new()
            {
                ExecutionTime = scheduled,
                Activity = async (CancellationToken ct) => await VerifyStationIn(stationNumber, scheduled)
            });
        }

        private async Task VerifyStationIn(int stationNumber, DateTime scheduled)
        {
            var lastReceivedDate = await _dadosRepository.GetStationLastReceivedDate(stationNumber);

            var timedOut = lastReceivedDate < scheduled;

            if (timedOut)
            {
                await _estacaoRepository.AlterarStatus(stationNumber, Status.Desligada);
                return;
            }

            ScheduleStationShutdownIn(stationNumber, lastReceivedDate);
        }
    }

    public class ScheduledActivity
    {
        public required DateTime ExecutionTime { get; set; }
        public required Func<CancellationToken, Task> Activity { get; set; }
    }

    public class TaskManager
    {
        private readonly object _lock = new();
        private readonly PriorityQueue<ScheduledActivity, DateTime> _queue = new();

        public void Enqueue(ScheduledActivity item)
        {
            lock (_lock)
            {
                _queue.Enqueue(item, item.ExecutionTime);
            }
        }

        public ScheduledActivity Dequeue()
        {
            lock (_lock)
            {
                return _queue.Dequeue();
            }
        }

        public bool Any()
        {
            return _queue.Count > 0;
        }
    }
}