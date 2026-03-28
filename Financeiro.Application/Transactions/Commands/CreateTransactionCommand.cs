using Financeiro.Domain.Entities;
using MediatR;

namespace Financeiro.Application.Transactions.Commands;

public record CreateTransactionCommand(
    string Description,
    decimal Amount,
    string Category,
    DateTime TransactionDate,
    TransactionType Type,
    Guid AccountId) : IRequest<Guid>;