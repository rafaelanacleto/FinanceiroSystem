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

    public AccountSummaryDto(decimal totalIncome, decimal totalExpenses, decimal annualBalance, List<CategorySummaryDto> categoryExpenses)
    {
        TotalIncome = totalIncome;
        TotalExpenses = totalExpenses;
        Balance = totalIncome - totalExpenses;
        AnnualBalance = annualBalance;
        CategoryExpenses = categoryExpenses;
    }
}

public record CategorySummaryDto(string Category, decimal Total);