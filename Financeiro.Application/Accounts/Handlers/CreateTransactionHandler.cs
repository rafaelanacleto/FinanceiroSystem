using Financeiro.Application.Transactions.Commands;
using Financeiro.Domain.Entities;
using Financeiro.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;

namespace Financeiro.Application.Transactions.Handlers;

// 2. O Handler com lógica de persistência e invalidação de cache
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
        // Validação: A conta existe? 
        var accountExists = await _context.Accounts
            .AnyAsync(a => a.Id == request.AccountId, cancellationToken);

        if (!accountExists)
        {
            throw new Exception("Conta não encontrada para realizar a transação.");
        }

        // Criando a entidade de domínio
        var transaction = new Transaction
        {
            Description = request.Description,
            Amount = request.Amount,
            TransactionDate = request.TransactionDate,
            Type = request.Type,
            AccountId = request.AccountId
        };

        // Salvando no SQL Server
        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync(cancellationToken);

        // --- ESTRATÉGIA DE CACHE (Invalidação) ---
        // Sempre que uma nova transação entra, o saldo no Redis torna-se obsoleto.
        // A próxima Query de saldo será forçada a ler do SQL e atualizar o Redis.
        string cacheKey = $"balance_{request.AccountId}";
        await _cache.RemoveAsync(cacheKey, cancellationToken);

        _logger.LogInformation("Nova transação financeira: {Type} de {Amount} na conta {AccountId}", 
        request.Type, request.Amount, request.AccountId);

        return transaction.Id;
    }
}