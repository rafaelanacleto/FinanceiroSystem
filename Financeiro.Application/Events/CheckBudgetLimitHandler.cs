using MediatR;
using Microsoft.EntityFrameworkCore;
using Financeiro.Domain.Entities;
using Financeiro.Domain.Event;
using Financeiro.Infrastructure.Data;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Financeiro.Application.Events
{
    public class CheckBudgetLimitHandler : INotificationHandler<TransactionCreatedEvent>
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<CheckBudgetLimitHandler> _logger;

        public CheckBudgetLimitHandler(ApplicationDbContext context, ILogger<CheckBudgetLimitHandler> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task Handle(TransactionCreatedEvent notification, CancellationToken cancellationToken)
        {
            _logger.LogInformation("CheckBudgetLimitHandler: Processando evento de transação criada para ID {TransactionId}", notification.TransactionId);

            var account = await _context.Accounts
                .FirstOrDefaultAsync(a => a.Id == notification.AccountId, cancellationToken);

            if (account == null)
            {
                _logger.LogWarning("CheckBudgetLimitHandler: Conta {AccountId} não encontrada para a transação {TransactionId}", notification.AccountId, notification.TransactionId);
                return;
            }

            var userIdStr = account.UserId.ToString();

            // 1. Alerta de Saldo Negativo
            if (account.Balance < 0)
            {
                var balanceAlertMessage = $"Sua conta '{account.Name}' está com saldo negativo de {account.Balance:C}.";

                var alreadyNotified = await _context.Notifications
                    .AnyAsync(n => n.UserId == userIdStr && n.Message == balanceAlertMessage && !n.IsRead, cancellationToken);

                if (!alreadyNotified)
                {
                    var balanceNotification = new Notification
                    {
                        Id = Guid.NewGuid(),
                        UserId = userIdStr,
                        Title = "Saldo Negativo Detectado",
                        Message = balanceAlertMessage,
                        Type = "Alert",
                        IsRead = false,
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.Notifications.Add(balanceNotification);
                    _logger.LogInformation("CheckBudgetLimitHandler: Notificação de saldo negativo gerada para o usuário {UserId}", userIdStr);
                }
            }

            // 2. Alerta de Limite da Categoria (BRL 1000,00 por categoria de despesa por mês)
            var transaction = await _context.Transactions
                .FirstOrDefaultAsync(t => t.Id == notification.TransactionId, cancellationToken);

            if (transaction != null && transaction.Type == TransactionType.Expense && !string.IsNullOrEmpty(transaction.Category))
            {
                var startOfMonth = new DateTime(transaction.TransactionDate.Year, transaction.TransactionDate.Month, 1, 0, 0, 0, DateTimeKind.Utc);

                var totalCategorySpent = await _context.Transactions
                    .Where(t => t.AccountId == account.Id 
                             && t.Category == transaction.Category 
                             && t.Type == TransactionType.Expense
                             && t.TransactionDate >= startOfMonth)
                    .SumAsync(t => t.Amount, cancellationToken);

                const decimal CategoryLimit = 1000.00m;

                if (totalCategorySpent > CategoryLimit)
                {
                    var categoryAlertMessage = $"Você atingiu {totalCategorySpent:C} de gastos na categoria '{transaction.Category}' este mês, superando o limite estabelecido de {CategoryLimit:C}.";

                    var alreadyNotified = await _context.Notifications
                        .AnyAsync(n => n.UserId == userIdStr && n.Message == categoryAlertMessage && !n.IsRead, cancellationToken);

                    if (!alreadyNotified)
                    {
                        var limitNotification = new Notification
                        {
                            Id = Guid.NewGuid(),
                            UserId = userIdStr,
                            Title = "Limite de Categoria Excedido",
                            Message = categoryAlertMessage,
                            Type = "Alert",
                            IsRead = false,
                            CreatedAt = DateTime.UtcNow
                        };
                        _context.Notifications.Add(limitNotification);
                        _logger.LogInformation("CheckBudgetLimitHandler: Notificação de limite excedido gerada para a categoria {Category} do usuário {UserId}", transaction.Category, userIdStr);
                    }
                }
            }

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}