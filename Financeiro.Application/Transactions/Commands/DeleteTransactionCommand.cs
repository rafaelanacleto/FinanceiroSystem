using Financeiro.Domain.Entities;
using MediatR;

namespace Financeiro.Application.Transactions.Commands;

public record DeleteTransactionCommand(Guid Id) : IRequest<Guid>;