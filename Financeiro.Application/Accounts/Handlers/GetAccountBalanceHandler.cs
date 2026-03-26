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
        string cacheKey = CacheKeys.AccountBalance(request.AccountId);

        // 1. Tenta buscar no Redis
        var cachedBalance = await _cache.GetStringAsync(cacheKey, cancellationToken);
        if (!string.IsNullOrEmpty(cachedBalance))
        {
            return decimal.Parse(cachedBalance, CultureInfo.InvariantCulture);
        }

        // 2. Se não estiver no cache, calcula do SQL Server
        var balance = await _context.Transactions
            .Where(t => t.AccountId == request.AccountId)
            .SumAsync(t => t.Type == Domain.Entities.TransactionType.Income ? t.Amount : -t.Amount, cancellationToken);

        // 3. Salva no Redis por 10 minutos (Cache-Aside)
        await _cache.SetStringAsync(cacheKey, balance.ToString(CultureInfo.InvariantCulture), new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
        }, cancellationToken);

        return balance;
    }
}
