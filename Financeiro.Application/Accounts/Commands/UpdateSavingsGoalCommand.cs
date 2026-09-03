using MediatR;

namespace Financeiro.Application.Accounts.Commands;

public record UpdateSavingsGoalCommand(Guid UserId, decimal MonthlySavingsGoal) : IRequest<decimal>;
