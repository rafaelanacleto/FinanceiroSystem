using Financeiro.Application.Accounts.Commands;
using Financeiro.Domain.Entities;
using Financeiro.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Financeiro.Application.Accounts.Handlers;

public class UpdateSavingsGoalHandler : IRequestHandler<UpdateSavingsGoalCommand, decimal>
{
    private readonly ApplicationDbContext _context;

    public UpdateSavingsGoalHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<decimal> Handle(UpdateSavingsGoalCommand request, CancellationToken cancellationToken)
    {
        if (request.MonthlySavingsGoal <= 0)
            throw new ArgumentException("A meta de economia deve ser maior que zero.");

        var preference = await _context.UserPreferences
            .SingleOrDefaultAsync(p => p.UserId == request.UserId, cancellationToken);

        if (preference is null)
        {
            preference = new UserPreference
            {
                UserId = request.UserId,
                MonthlySavingsGoal = request.MonthlySavingsGoal
            };
            _context.UserPreferences.Add(preference);
        }
        else
        {
            preference.MonthlySavingsGoal = request.MonthlySavingsGoal;
        }

        await _context.SaveChangesAsync(cancellationToken);
        return preference.MonthlySavingsGoal;
    }
}
