using Financeiro.Domain.Entities;
using Financeiro.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Financeiro.Application.Accounts.Queries;

public record GetSavingsGoalQuery(Guid UserId) : IRequest<decimal>;

public class GetSavingsGoalHandler : IRequestHandler<GetSavingsGoalQuery, decimal>
{
    private readonly ApplicationDbContext _context;

    public GetSavingsGoalHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<decimal> Handle(GetSavingsGoalQuery request, CancellationToken cancellationToken)
    {
        return await _context.UserPreferences
            .AsNoTracking()
            .Where(p => p.UserId == request.UserId)
            .Select(p => (decimal?)p.MonthlySavingsGoal)
            .SingleOrDefaultAsync(cancellationToken) ?? UserPreference.DefaultMonthlySavingsGoal;
    }
}
