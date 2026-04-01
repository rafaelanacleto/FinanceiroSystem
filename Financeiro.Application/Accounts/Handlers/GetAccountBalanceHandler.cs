using Financeiro.Application.Common;
using Financeiro.Application.Accounts.Queries;
using Financeiro.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using System.Globalization;

namespace Financeiro.Application.Accounts.Handlers;

public class GetAccountBalanceHandler : IRequestHandler<GetAccountBalanceQuery, decimal>
{
    private readonly ApplicationDbContext _context;
    private readonly IDistributedCache _cache;

    public GetAccountBalanceHandler(ApplicationDbContext context, IDistributedCache cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<decimal> Handle(GetAccountBalanceQuery request, CancellationToken cancellationToken)
    {
        // 1. IMPORTANTE: Primeiro, garantimos que o usuário tenha uma conta vinculada ao seu UserId do Keycloak
        // No request, agora passamos o UserId vindo do Token.
        var account = await _context.Accounts
            .FirstOrDefaultAsync(a => a.UserId == request.UserId, cancellationToken);

        // 2. FLOW DE BOAS-VINDAS: Se a Alice logou e não tem conta, criamos agora!
        if (account == null)
        {
            account = new Domain.Entities.Account
            {
                UserId = request.UserId,
                Name = "Minha Carteira"
            };
            _context.Accounts.Add(account);
            await _context.SaveChangesAsync(cancellationToken);
            
            // Como a conta é nova, o saldo é zero e não há nada no cache.
            return 0;
        }

        // 3. LOGICA DE CACHE: Usamos o Id da conta encontrada (ou criada)
        string cacheKey = CacheKeys.AccountBalance(account.Id);
        var cachedBalance = await _cache.GetStringAsync(cacheKey, cancellationToken);
        
        if (!string.IsNullOrEmpty(cachedBalance))
        {
            return decimal.Parse(cachedBalance, CultureInfo.InvariantCulture);
        }

        // 4. CÁLCULO: Soma as transações da conta do usuário
        var balance = await _context.Transactions
            .Where(t => t.AccountId == account.Id)
            .SumAsync(t => t.Type == Domain.Entities.TransactionType.Income ? t.Amount : -t.Amount, cancellationToken);

        // 5. ATUALIZA CACHE
        await _cache.SetStringAsync(cacheKey, balance.ToString(CultureInfo.InvariantCulture), new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
        }, cancellationToken);

        return balance;
    }
}