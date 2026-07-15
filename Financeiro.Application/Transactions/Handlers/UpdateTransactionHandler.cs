using Financeiro.Application.Transactions.Commands;
using Financeiro.Domain.Exceptions;
using Financeiro.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Financeiro.Application.Transactions.Handlers;

public class UpdateTransactionHandler : IRequestHandler<UpdateTransactionCommand, Unit>
{
    private readonly ApplicationDbContext _context;

    public UpdateTransactionHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(UpdateTransactionCommand request, CancellationToken cancellationToken)
    {
        var transaction = await _context.Transactions
            .FirstOrDefaultAsync(t => t.Id == request.Id, cancellationToken);

        if (transaction == null)
            throw new NotFoundException("Transação não encontrada.");

        transaction.Description = request.Description;
        transaction.Amount = request.Amount;
        transaction.Category = request.Category;
        transaction.TransactionDate = request.TransactionDate.Kind == DateTimeKind.Utc
            ? request.TransactionDate
            : request.TransactionDate.ToUniversalTime();
        transaction.Type = request.Type;

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
