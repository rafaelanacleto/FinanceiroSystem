using Financeiro.Application.Common;
using Financeiro.Application.Transactions.Commands;
using Financeiro.Domain.Entities;
using Financeiro.Domain.Exceptions;
using Financeiro.Infrastructure.Data;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;

namespace Financeiro.Application.Transactions.Handlers;

public class CreateTransactionHandler : IRequestHandler<CreateTransactionCommand, Guid>
{
    private readonly ApplicationDbContext _context;
    private readonly IDistributedCache _cache;
    private readonly ILogger<CreateTransactionHandler> _logger;
    private readonly IHttpContextAccessor _httpContextAccessor; // Injeção necessária

    public CreateTransactionHandler(
        ApplicationDbContext context, 
        IDistributedCache cache, 
        ILogger<CreateTransactionHandler> logger,
        IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _cache = cache;
        _logger = logger;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<Guid> Handle(CreateTransactionCommand request, CancellationToken cancellationToken)
    {
        // 1. Extrair o ID do usuário diretamente do Token JWT do Keycloak
        var userId = _httpContextAccessor.HttpContext?.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            throw new UnauthorizedAccessException("Usuário não identificado.");

        // 2. VALIDAR SEGURANÇA: A conta destino pertence ao usuário logado?
        // Isso impede que um usuário "A" mande o ID da conta do usuário "B" no JSON.
        var accountOwner = await _context.Accounts
            .AnyAsync(a => a.Id == request.AccountId && a.UserId == userGuid, cancellationToken);

        if (!accountOwner)
        {
            _logger.LogWarning("Tentativa de acesso não autorizado: Usuário {UserId} tentou lançar na conta {AccountId}", userId, request.AccountId);
            throw new ForbiddenException("Você não tem permissão para lançar nesta conta.");
        }

        var transaction = new Transaction
        {
            Description = request.Description,
            Amount = request.Amount,
            TransactionDate = DateTime.UtcNow, // Recomendado usar UtcNow no servidor
            Type = request.Type,
            AccountId = request.AccountId,
            Category = request.Category
        };

        _context.Transactions.Add(transaction);

        await _context.SaveChangesAsync(cancellationToken);

        // Invalida o cache
        await _cache.RemoveAsync(CacheKeys.AccountBalance(request.AccountId), cancellationToken);

        _logger.LogInformation("Transação confirmada para o usuário {UserId} na conta {AccountId}", userId, request.AccountId);

        return transaction.Id;
    }
}
