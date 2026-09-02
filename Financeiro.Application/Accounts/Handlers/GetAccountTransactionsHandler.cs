using MediatR;
using Microsoft.EntityFrameworkCore;
using Financeiro.Application.Accounts.Queries;
using Financeiro.Infrastructure.Data;

namespace Financeiro.Application.Accounts.Handlers;

public class GetAccountTransactionsHandler : IRequestHandler<GetAccountTransactionsQuery, List<TransactionDto>>
{
    private readonly ApplicationDbContext _context;

    public GetAccountTransactionsHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<TransactionDto>> Handle(GetAccountTransactionsQuery request, CancellationToken cancellationToken)
    {
        var account = await _context.Accounts
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.UserId == request.UserId, cancellationToken);

        if (account == null)
            return [];

        var transactionsQuery = _context.Transactions
            .AsNoTracking()
            .Where(t => t.AccountId == account.Id);

        if (request.Month.HasValue && request.Year.HasValue)
        {
            var startDate = new DateTime(request.Year.Value, request.Month.Value, 1, 0, 0, 0, DateTimeKind.Utc);
            var endDate = startDate.AddMonths(1);

            transactionsQuery = transactionsQuery.Where(t =>
                t.CreatedAt >= startDate && t.CreatedAt < endDate);
        }

        return await transactionsQuery
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new TransactionDto(
                t.Id,
                t.Description,
                t.Category,
                t.Amount,
                (int)t.Type,
                t.CreatedAt
            ))
            .ToListAsync(cancellationToken);
    }
}
