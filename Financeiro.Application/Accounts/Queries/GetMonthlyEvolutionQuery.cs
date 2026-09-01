using MediatR;

namespace Financeiro.Application.Accounts.Queries;

public record GetMonthlyEvolutionQuery(
    Guid UserId,
    int Month,
    int Year
) : IRequest<List<MonthlyEvolutionDto>>;

public record MonthlyEvolutionDto(
    int Month,
    int Year,
    decimal TotalIncome,
    decimal TotalExpenses,
    decimal Balance
);