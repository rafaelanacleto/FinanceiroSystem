using Financeiro.Application.Accounts.Handlers;
using MediatR;

namespace Financeiro.Application.Accounts.Queries;

public record GetAccountSummaryQuery(
    Guid AccountId, 
    int Month, 
    int Year
) : IRequest<AccountSummaryDto>; // DTO que retorna saldo e categorias