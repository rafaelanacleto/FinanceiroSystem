using Financeiro.Application.Common;
using Financeiro.Application.Transactions.Commands;
using Financeiro.Domain.Entities;
using Financeiro.Domain.Exceptions;
using Financeiro.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;

namespace Financeiro.Application.Transactions.Handlers;

public class CreateTransactionHandler : IRequestHandler<CreateTransactionCommand, Guid>
{
    private readonly ApplicationDbContext _context;
    private readonly IDistributedCache _cache;
    private readonly ILogger<CreateTransactionHandler> _logger;

    public CreateTransactionHandler(ApplicationDbContext context, IDistributedCache cache, ILogger<CreateTransactionHandler> logger)
    {
        _context = context;
        _cache = cache;
        _logger = logger;
    }

    public async Task<Guid> Handle(CreateTransactionCommand request, CancellationToken cancellationToken)
    {
        var transaction = new Transaction
        {
            Description = request.Description,
            Amount = request.Amount,
            TransactionDate = request.TransactionDate,
            Type = request.Type,
            AccountId = request.AccountId,
            Category = request.Category
        };

        _context.Transactions.Add(transaction);

        try
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException)
        {
            throw new NotFoundException($"Conta {request.AccountId} não encontrada para realizar a transação.");
        }

        // Sempre que uma nova transação entra, o saldo no Redis torna-se obsoleto.
        // A próxima Query de saldo será forçada a ler do SQL e atualizar o Redis.
        await _cache.RemoveAsync(CacheKeys.AccountBalance(request.AccountId), cancellationToken);

        _logger.LogInformation("Nova transação financeira: {Type} de {Amount} na conta {AccountId}",
            request.Type, request.Amount, request.AccountId);

        return transaction.Id;
    }
}
