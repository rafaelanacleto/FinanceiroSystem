using MediatR;

namespace Financeiro.Application.Accounts.Queries;

// Trocamos AccountId por UserId para permitir o auto-provisionamento da Alice
public record GetAccountBalanceQuery(Guid UserId) : IRequest<decimal>;