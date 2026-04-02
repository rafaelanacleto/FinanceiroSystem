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
    public List<CategorySummaryDto> CategoryExpenses { get; set; } = [];

    public AccountSummaryDto(decimal totalIncome, decimal totalExpenses, List<CategorySummaryDto> categoryExpenses)
    {
        TotalIncome = totalIncome;
        TotalExpenses = totalExpenses;
        Balance = totalIncome - totalExpenses;
        CategoryExpenses = categoryExpenses;
    }
}

public record CategorySummaryDto(string Category, decimal Total);