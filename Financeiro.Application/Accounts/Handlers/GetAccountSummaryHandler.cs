using MediatR;
using Microsoft.EntityFrameworkCore;
using Financeiro.Application.Accounts.Queries;
using Financeiro.Infrastructure.Data;
using Financeiro.Domain.Entities;

namespace Financeiro.Application.Accounts.Handlers;

public class GetAccountSummaryHandler : IRequestHandler<GetAccountSummaryQuery, AccountSummaryDto>
{
    private readonly ApplicationDbContext _context;

    public GetAccountSummaryHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<AccountSummaryDto> Handle(GetAccountSummaryQuery request, CancellationToken cancellationToken)
    {
        var account = await _context.Accounts
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.UserId == request.UserId, cancellationToken);

        if (account == null)
            return new AccountSummaryDto(0, 0, []);

        var transactions = await _context.Transactions
            .AsNoTracking()
            .Where(t => t.AccountId == account.Id &&
                        t.CreatedAt.Month == request.Month &&
                        t.CreatedAt.Year == request.Year)
            .ToListAsync(cancellationToken);

        var income = transactions
            .Where(t => t.Type == TransactionType.Income)
            .Sum(t => t.Amount);

        var expenses = transactions
            .Where(t => t.Type == TransactionType.Expense)
            .Sum(t => t.Amount);

        var categoryExpenses = transactions
            .Where(t => t.Type == TransactionType.Expense)
            .GroupBy(t => t.Category)
            .Select(g => new CategorySummaryDto(
                g.Key,
                Math.Abs(g.Sum(x => x.Amount))
            ))
            .ToList();

        return new AccountSummaryDto(income, expenses, categoryExpenses);
    }
}
