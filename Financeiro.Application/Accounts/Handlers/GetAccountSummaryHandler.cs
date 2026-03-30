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
            // 1. Filtramos as transações da conta DO MÊS e ANO específicos
            var transactionsQuery = _context.Transactions
                .AsNoTracking()
                .Where(t => t.AccountId == request.AccountId &&
                            t.CreatedAt.Month == request.Month &&
                            t.CreatedAt.Year == request.Year);

            // 2. Calculamos os totais baseados nessa consulta filtrada
            var transactions = await transactionsQuery.ToListAsync(cancellationToken);

            var income = transactions
                .Where(t => t.Type == TransactionType.Income)
                .Sum(t => t.Amount);

            var expenses = transactions
                .Where(t => t.Type == TransactionType.Expense)
                .Sum(t => t.Amount);

            // 3. Agrupamos por categoria para o gráfico de pizza
            var categoryExpenses = transactions
                .Where(t => t.Type == TransactionType.Expense)
                .GroupBy(t => t.Category)
                .Select(g => new CategorySummaryDto(
                    g.Key,
                    Math.Abs(g.Sum(x => x.Amount))
                ))
                .ToList();

            return new AccountSummaryDto(income, expenses, categoryExpenses);
        }
    }

    public class AccountSummaryDto
    {
        public decimal TotalIncome { get; set; }
        public decimal TotalExpenses { get; set; }
        public decimal Balance { get; set; }
        public List<CategorySummaryDto> CategoryExpenses { get; internal set; }

        public AccountSummaryDto(decimal totalIncome, decimal totalExpenses, List<CategorySummaryDto> categoryExpenses)
        {
            TotalIncome = totalIncome;
            TotalExpenses = totalExpenses;
            Balance = totalIncome - totalExpenses;
            CategoryExpenses = categoryExpenses;
        }
    }

    public record CategorySummaryDto(string Category, decimal Total);
}