using MediatR;
using Microsoft.EntityFrameworkCore;
using Financeiro.Application.Accounts.Queries;
using Financeiro.Infrastructure.Data;

namespace Financeiro.Application.Accounts.Handlers;

public class GetAccountTransactionsHandler : IRequestHandler<GetAccountTransactionsQuery, List<TransactionDto>>
{
    private readonly ApplicationDbContext _context;

    public GetAccountTransactionsHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<TransactionDto>> Handle(GetAccountTransactionsQuery request, CancellationToken cancellationToken)
    {
        var account = await _context.Accounts
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.UserId == request.UserId, cancellationToken);

        if (account == null)
            return [];

        return await _context.Transactions
            .AsNoTracking()
            .Where(t => t.AccountId == account.Id)
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new TransactionDto(
                t.Id,
                t.Description,
                t.Category,
                t.Amount,
                (int)t.Type,
                t.CreatedAt
            ))
            .ToListAsync(cancellationToken);
    }
}
