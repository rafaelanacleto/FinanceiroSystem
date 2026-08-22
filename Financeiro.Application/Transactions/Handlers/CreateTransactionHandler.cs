using Financeiro.Application.Common;
using Financeiro.Application.Common.Interfaces;
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
    private readonly IUserService _userService;
    private readonly IMediator _mediator;

    public CreateTransactionHandler(
        ApplicationDbContext context,
        IDistributedCache cache,
        ILogger<CreateTransactionHandler> logger,
        IUserService userService,
        IMediator mediator)
    {
        _context = context;
        _cache = cache;
        _logger = logger;
        _userService = userService;
        _mediator = mediator;
    }

    public async Task<Guid> Handle(CreateTransactionCommand request, CancellationToken cancellationToken)
    {
        var userId = _userService.GetUserId();              
        var userName = _userService.GetUserName(); // Agora pegamos via serviço!

        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            throw new UnauthorizedAccessException("Usuário não identificado.");

        var account = await _context.Accounts
            .FirstOrDefaultAsync(a => a.UserId == userGuid, cancellationToken);

        if (account == null)
        {
            account = new Account
            {
                Id = Guid.NewGuid(), // Geramos um novo ID de conta
                UserId = userGuid,
                Name = $"Carteira de {userName}", // Concatenação limpa
                Balance = 0
            };
            _context.Accounts.Add(account);
            await _context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Conta provisionada automaticamente para o novo usuário {UserId}", userGuid);
        }

        // 3. AGORA O PULO DO GATO: Usamos account.Id (o ID real do banco) 
        // e ignoramos o request.AccountId que veio do frontend
        var transaction = new Transaction
        {
            Description = request.Description,
            Amount = request.Amount,
            TransactionDate = request.TransactionDate.Kind == DateTimeKind.Utc
                ? request.TransactionDate
                : request.TransactionDate.ToUniversalTime(),
            Type = request.Type,
            AccountId = account.Id, // <--- AQUI ESTAVA O ERRO! Use o ID do objeto 'account'
            Category = request.Category
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync(cancellationToken);

        // Dispara o evento de transação criada
        await _mediator.Publish(new Financeiro.Domain.Event.TransactionCreatedEvent(transaction.Id, account.Id, transaction.Amount, transaction.TransactionDate), cancellationToken);

        try
        {
            await _cache.RemoveAsync(CacheKeys.AccountBalance(account.Id), cancellationToken);
        }
        catch (Exception ex)
        {
            // Cache is best-effort: transaction should still succeed when Redis is unavailable.
            _logger.LogWarning(ex, "Falha ao invalidar cache de saldo para a conta {AccountId}", account.Id);
        }

        _logger.LogInformation("Transação confirmada para o usuário {UserId} na conta {AccountId}", userId, account.Id);

        return transaction.Id;
    }
}
