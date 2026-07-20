using Financeiro.Infrastructure.Data;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Financeiro.Infrastructure.BackgroundServices;

public class NotificationAutomationWorker : BackgroundService
{
    private readonly ILogger<NotificationAutomationWorker> _logger;
    private readonly IServiceProvider _serviceProvider;

    public NotificationAutomationWorker(ILogger<NotificationAutomationWorker> logger, IServiceProvider serviceProvider)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                    // Lógica para processar notificações
                    var notificationsToProcess = await dbContext.Notifications
                        .Where(n => !n.IsRead)
                        .ToListAsync(stoppingToken);

                    foreach (var notification in notificationsToProcess)
                    {
                        // Processar a notificação (exemplo: enviar e-mail, SMS, etc.)
                        // ...

                        // Marcar como processada
                        notification.IsProcessed = true;
                    }

                    await dbContext.SaveChangesAsync(stoppingToken);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao processar notificações.");
            }

            // Aguardar um intervalo antes de verificar novamente
            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }
}