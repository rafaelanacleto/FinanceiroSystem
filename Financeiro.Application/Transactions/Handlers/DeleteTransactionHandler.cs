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

public class DeleteTransactionHandler : IRequestHandler<DeleteTransactionCommand, Guid>
{
    private readonly ApplicationDbContext _context;
    private readonly IDistributedCache _cache;
    private readonly ILogger<DeleteTransactionHandler> _logger;
    private readonly IUserService _userService;

    public DeleteTransactionHandler(
        ApplicationDbContext context,
        IDistributedCache cache,
        ILogger<DeleteTransactionHandler> logger,
        IUserService userService)
    {
        _context = context;
        _cache = cache;
        _logger = logger;
        _userService = userService;
    }

    public async Task<Guid> Handle(DeleteTransactionCommand request, CancellationToken cancellationToken)
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

        var transaction = await _context.Transactions
            .FirstOrDefaultAsync(t => t.Id == request.Id && t.Account.UserId == userGuid, cancellationToken);

        if (transaction == null)
            throw new NotFoundException("Transação não encontrada.");

        _context.Transactions.Remove(transaction);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Transação {TransactionId} deletada pelo usuário {UserId}", request.Id, userGuid);

        return request.Id;

    }
}