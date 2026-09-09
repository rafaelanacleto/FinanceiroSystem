using MediatR;

namespace Financeiro.Application.Accounts.Queries;

public record GetAccountSummaryQuery(
    Guid UserId,
    int Month,
    int Year
) : IRequest<AccountSummaryDto>;

public class AccountSummaryDto
{
    public decimal TotalIncome { get; set; }
    public decimal TotalExpenses { get; set; }
    public decimal Balance { get; set; }
    public decimal AnnualBalance { get; set; }
    public List<CategorySummaryDto> CategoryExpenses { get; set; } = [];
    public SavingsGoalDto SavingsGoal { get; set; }
    public SpendingProfileDto SpendingProfile { get; set; }

    public AccountSummaryDto(decimal totalIncome, decimal totalExpenses, decimal annualBalance, List<CategorySummaryDto> categoryExpenses, SavingsGoalDto? savingsGoal = null, SpendingProfileDto? spendingProfile = null)
    {
        TotalIncome = totalIncome;
        TotalExpenses = totalExpenses;
        Balance = totalIncome - totalExpenses;
        AnnualBalance = annualBalance;
        CategoryExpenses = categoryExpenses;
        SavingsGoal = savingsGoal ?? new SavingsGoalDto(0, 0, 0);
        SpendingProfile = spendingProfile ?? new SpendingProfileDto(0, 0, 0, 0, false, null, null);
    }
}

public record CategorySummaryDto(string Category, decimal Total);
public record SavingsGoalDto(decimal Current, decimal Target, decimal Percentage);

public record SpendingProfileDto(
    decimal EssentialTotal,
    decimal SuperfluousTotal,
    decimal EssentialPercentage,
    decimal SuperfluousPercentage,
    bool HasPreviousMonthData,
    decimal? PercentageDiff,
    bool? IsHigher);