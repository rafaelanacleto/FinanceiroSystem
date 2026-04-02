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

    public CreateTransactionHandler(
        ApplicationDbContext context,
        IDistributedCache cache,
        ILogger<CreateTransactionHandler> logger,
        IUserService userService)
    {
        _context = context;
        _cache = cache;
        _logger = logger;
        _userService = userService;
    }

    public async Task<Guid> Handle(CreateTransactionCommand request, CancellationToken cancellationToken)
    {
        var userId = _userService.GetUserId();              
        var userName = _userService.GetUserName(); // Agora pegamos via serviço!

        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            throw new UnauthorizedAccessException("Usuário não identificado.");


        // 2. CONVERSÃO CRUCIAL: Transformamos a string em Guid para o SQL entender
        if (!Guid.TryParse(userId, out Guid userGuidNew))
            throw new UnauthorizedAccessException("ID de usuário inválido.");            

        var account = await _context.Accounts
            .FirstOrDefaultAsync(a => a.UserId == userGuidNew, cancellationToken);

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

        await _cache.RemoveAsync(CacheKeys.AccountBalance(account.Id), cancellationToken);

        _logger.LogInformation("Transação confirmada para o usuário {UserId} na conta {AccountId}", userId, account.Id);

        return transaction.Id;
    }
}
