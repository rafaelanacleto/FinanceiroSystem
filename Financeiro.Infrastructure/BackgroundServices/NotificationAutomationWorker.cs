using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Financeiro.Domain.Entities;
using Financeiro.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
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
        _logger.LogInformation("NotificationAutomationWorker iniciado.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                    // Consideramos contas a pagar como transações de tipo Expense que estão agendadas no futuro próximo (próximos 3 dias)
                    var targetDateStart = DateTime.UtcNow;
                    var targetDateEnd = DateTime.UtcNow.AddDays(3);

                    var upcomingBills = await dbContext.Transactions
                        .Include(t => t.Account)
                        .Where(t => t.Type == TransactionType.Expense 
                                 && t.TransactionDate >= targetDateStart 
                                 && t.TransactionDate <= targetDateEnd)
                        .ToListAsync(stoppingToken);

                    foreach (var bill in upcomingBills)
                    {
                        var userIdStr = bill.Account?.UserId.ToString();
                        if (string.IsNullOrEmpty(userIdStr)) continue;

                        var message = $"A despesa '{bill.Description}' no valor de {bill.Amount:C} está agendada para {bill.TransactionDate.ToLocalTime():dd/MM/yyyy}.";

                        // Verificar se já existe uma notificação de alerta idêntica para o usuário
                        var notificationExists = await dbContext.Notifications
                            .AnyAsync(n => n.UserId == userIdStr && n.Message == message, stoppingToken);

                        if (!notificationExists)
                        {
                            var notification = new Notification
                            {
                                Id = Guid.NewGuid(),
                                UserId = userIdStr,
                                Title = "Alerta de Vencimento",
                                Message = message,
                                Type = "Info",
                                IsRead = false,
                                CreatedAt = DateTime.UtcNow
                            };

                            dbContext.Notifications.Add(notification);
                            _logger.LogInformation("NotificationAutomationWorker: Gerada notificação de vencimento para o usuário {UserId}: {Description}", userIdStr, bill.Description);
                        }
                    }

                    await dbContext.SaveChangesAsync(stoppingToken);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "NotificationAutomationWorker: Erro ao processar alertas de vencimento.");
            }

            // Rodar a cada 24 horas como um worker diário
            await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
        }
    }
}