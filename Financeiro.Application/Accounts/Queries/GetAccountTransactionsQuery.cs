using MediatR;

namespace Financeiro.Application.Accounts.Queries;

public record TransactionDto(
    Guid Id,
    string Description,
    string Category,
    decimal Amount,
    int Type,
    DateTime TransactionDate
);

public record GetAccountTransactionsQuery(
    Guid UserId,
    int? Month = null,
    int? Year = null
) : IRequest<List<TransactionDto>>;
