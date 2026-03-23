using Financeiro.Application.Accounts.Commands;
using Financeiro.Domain.Entities;
using Financeiro.Infrastructure.Data;
using MediatR;

namespace Financeiro.Application.Accounts.Handlers;
//(A lógica de negócio)
public class CreateAccountHandler : IRequestHandler<CreateAccountCommand, Guid>
{
    private readonly ApplicationDbContext _context;

    public CreateAccountHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateAccountCommand request, CancellationToken cancellationToken)
    {
        var account = new Account 
        { 
            Name = request.Name, 
            Description = request.Description, 
            Currency = request.Currency,
            UserId = request.UserId 
        };

        _context.Accounts.Add(account);
        await _context.SaveChangesAsync(cancellationToken);

        return account.Id;
    }
}