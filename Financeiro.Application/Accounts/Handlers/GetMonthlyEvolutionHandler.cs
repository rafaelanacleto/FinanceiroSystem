using Financeiro.Application.Accounts.Queries;
using Financeiro.Domain.Entities;
using Financeiro.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Financeiro.Application.Accounts.Handlers;

public class GetMonthlyEvolutionHandler : IRequestHandler<GetMonthlyEvolutionQuery, List<MonthlyEvolutionDto>>
{
    private readonly ApplicationDbContext _context;

    public GetMonthlyEvolutionHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<MonthlyEvolutionDto>> Handle(
        GetMonthlyEvolutionQuery request,
        CancellationToken cancellationToken)
    {
        var endDate = new DateTime(request.Year, request.Month, 1, 0, 0, 0, DateTimeKind.Utc).AddMonths(1);
        var startDate = endDate.AddMonths(-6);

        var monthlyTotals = await _context.Transactions
            .AsNoTracking()
            .Where(transaction => transaction.Account.UserId == request.UserId &&
                                  transaction.CreatedAt >= startDate &&
                                  transaction.CreatedAt < endDate)
            .GroupBy(transaction => new { transaction.CreatedAt.Year, transaction.CreatedAt.Month })
            .Select(group => new
            {
                group.Key.Year,
                group.Key.Month,
                TotalIncome = group
                    .Where(transaction => transaction.Type == TransactionType.Income)
                    .Sum(transaction => transaction.Amount),
                TotalExpenses = group
                    .Where(transaction => transaction.Type == TransactionType.Expense)
                    .Sum(transaction => transaction.Amount)
            })
            .ToListAsync(cancellationToken);

        var totalsByMonth = monthlyTotals.ToDictionary(
            total => (total.Year, total.Month),
            total => (total.TotalIncome, total.TotalExpenses));

        return Enumerable.Range(0, 6)
            .Select(index => startDate.AddMonths(index))
            .Select(date =>
            {
                var totals = totalsByMonth.GetValueOrDefault((date.Year, date.Month));
                return new MonthlyEvolutionDto(
                    date.Month,
                    date.Year,
                    totals.TotalIncome,
                    totals.TotalExpenses,
                    totals.TotalIncome - totals.TotalExpenses);
            })
            .ToList();
    }
}