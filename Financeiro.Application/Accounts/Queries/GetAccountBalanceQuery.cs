using MediatR;

namespace Financeiro.Application.Accounts.Queries;

public record GetAccountBalanceQuery(Guid AccountId) : IRequest<decimal>;