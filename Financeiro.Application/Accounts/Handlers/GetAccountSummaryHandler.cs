using MediatR;
using Microsoft.EntityFrameworkCore;
using Financeiro.Application.Accounts.Queries;
using Financeiro.Infrastructure.Data;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Financeiro.Domain.Entities;

namespace Financeiro.Application.Accounts.Handlers
{
    public class GetAccountSummaryHandler : IRequestHandler<GetAccountSummaryQuery, AccountSummaryDto>
    {
        private readonly ApplicationDbContext _context;
        private readonly IDistributedCache _cache;
        private readonly ILogger<GetAccountSummaryHandler> _logger;

        public GetAccountSummaryHandler(ApplicationDbContext context, IDistributedCache cache, ILogger<GetAccountSummaryHandler> logger)
        {
            _context = context;
            _cache = cache;
            _logger = logger;
        }

        public async Task<AccountSummaryDto> Handle(GetAccountSummaryQuery request, CancellationToken cancellationToken)
        {
            var transactions = await _context.Transactions
                .Where(t => t.AccountId == request.UserId)
                .ToListAsync(cancellationToken);

            // No Handler, adicione a lógica de agrupamento:
            var categoryExpenses = transactions
                .Where(t => t.Type == TransactionType.Expense)
                .GroupBy(t => t.Category)
                .Select(g => new CategorySummaryDto(
                    g.Key,
                    Math.Abs(g.Sum(t => t.Amount)),
                    "" // A cor podemos definir no Frontend
                ))
                .ToList();

            var income = transactions.Where(t => t.Type == TransactionType.Income).Sum(t => t.Amount);
            var expenses = transactions.Where(t => t.Type == TransactionType.Expense).Sum(t => t.Amount);

            return new AccountSummaryDto
            {
                TotalIncome = income,
                TotalExpenses = expenses,
                Balance = income - expenses,
                CategoryExpenses = categoryExpenses
            };
        }
    }

    public class AccountSummaryDto
    {
        public decimal TotalIncome { get; set; }
        public decimal TotalExpenses { get; set; }
        public decimal Balance { get; set; }
        public List<CategorySummaryDto> CategoryExpenses { get; internal set; }
    }

    public record CategorySummaryDto(string Category, decimal Total, string Color);
}