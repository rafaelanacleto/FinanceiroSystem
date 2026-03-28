using Financeiro.Application.Accounts.Handlers;
using MediatR;

namespace Financeiro.Application.Accounts.Queries;

public record GetAccountSummaryQuery(Guid UserId) : IRequest<AccountSummaryDto>;