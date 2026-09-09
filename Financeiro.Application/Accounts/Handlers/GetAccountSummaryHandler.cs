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
        {
            return new AccountSummaryDto(
                0,
                0,
                0,
                [],
                new SavingsGoalDto(0, UserPreference.DefaultMonthlySavingsGoal, 0));
        }

        var savingsGoal = await _context.UserPreferences
            .AsNoTracking()
            .Where(p => p.UserId == request.UserId)
            .Select(p => (decimal?)p.MonthlySavingsGoal)
            .SingleOrDefaultAsync(cancellationToken) ?? UserPreference.DefaultMonthlySavingsGoal;

        var transactions = await _context.Transactions
            .AsNoTracking()
            .Where(t => t.AccountId == account.Id &&
                        t.TransactionDate.Month == request.Month &&
                        t.TransactionDate.Year == request.Year)
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

        var annualIncome = await _context.Transactions
            .AsNoTracking()
            .Where(t => t.AccountId == account.Id &&
                        t.TransactionDate.Year == request.Year &&
                        t.Type == TransactionType.Income)
            .SumAsync(t => t.Amount, cancellationToken);

        var annualExpenses = await _context.Transactions
            .AsNoTracking()
            .Where(t => t.AccountId == account.Id &&
                        t.TransactionDate.Year == request.Year &&
                        t.Type == TransactionType.Expense)
            .SumAsync(t => t.Amount, cancellationToken);

        var annualBalance = annualIncome - annualExpenses;

        var currentSavings = income - expenses;
        var percentage = savingsGoal > 0 ? currentSavings / savingsGoal * 100 : 0;

        var essentialTotal = transactions
            .Where(t => t.Type == TransactionType.Expense && SpendingCategoryClassifier.IsEssential(t.Category))
            .Sum(t => Math.Abs(t.Amount));

        var superfluousTotal = expenses - essentialTotal;

        var essentialPercentage = expenses > 0 ? essentialTotal / expenses * 100 : 0;
        var superfluousPercentage = expenses > 0 ? superfluousTotal / expenses * 100 : 0;

        var previousMonthDate = new DateTime(request.Year, request.Month, 1).AddMonths(-1);

        var previousMonthExpenses = await _context.Transactions
            .AsNoTracking()
            .Where(t => t.AccountId == account.Id &&
                        t.TransactionDate.Month == previousMonthDate.Month &&
                        t.TransactionDate.Year == previousMonthDate.Year &&
                        t.Type == TransactionType.Expense)
            .Select(t => t.Amount)
            .ToListAsync(cancellationToken);

        var hasPreviousMonthData = previousMonthExpenses.Count > 0;
        var previousExpensesTotal = previousMonthExpenses.Sum();

        decimal? percentageDiff = null;
        bool? isHigher = null;
        if (hasPreviousMonthData && previousExpensesTotal > 0)
        {
            percentageDiff = Math.Abs((expenses - previousExpensesTotal) / previousExpensesTotal * 100);
            isHigher = expenses > previousExpensesTotal;
        }

        var spendingProfile = new SpendingProfileDto(
            essentialTotal,
            superfluousTotal,
            essentialPercentage,
            superfluousPercentage,
            hasPreviousMonthData,
            percentageDiff,
            isHigher);

        return new AccountSummaryDto(
            income,
            expenses,
            annualBalance,
            categoryExpenses,
            new SavingsGoalDto(currentSavings, savingsGoal, percentage),
            spendingProfile);
    }
}
