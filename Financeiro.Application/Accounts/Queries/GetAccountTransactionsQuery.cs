using MediatR;

namespace Financeiro.Application.Accounts.Queries;

public record TransactionDto(
    Guid Id,
    string Description,
    string Category,
    decimal Amount,
    int Type,
    DateTime CreatedAt
);

public record GetAccountTransactionsQuery(Guid UserId) : IRequest<List<TransactionDto>>;
