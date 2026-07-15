using Financeiro.Domain.Entities;
using MediatR;

namespace Financeiro.Application.Transactions.Commands;

public record UpdateTransactionCommand(
    Guid Id,
    string Description,
    decimal Amount,
    string Category,
    DateTime TransactionDate,
    TransactionType Type) : IRequest<Unit>;
