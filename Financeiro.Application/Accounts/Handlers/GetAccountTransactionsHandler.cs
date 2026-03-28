using MediatR;
using Microsoft.EntityFrameworkCore;
using Financeiro.Domain; // Ajuste para o seu namespace de contexto
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Financeiro.Infrastructure.Data;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;

namespace Financeiro.Application.Accounts.Handlers;

// 1. Definição do DTO (O que o React vai receber)
public record TransactionDto(
    Guid Id, 
    string Description, 
    decimal Amount, 
    int Type, 
    DateTime CreatedAt
);

// 2. Definição da Query (Obrigatório herdar de IRequest)
public record GetAccountTransactionsQuery(Guid AccountId) : IRequest<List<TransactionDto>>;

// 3. O Handler propriamente dito
public class GetAccountTransactionsHandler : IRequestHandler<GetAccountTransactionsQuery, List<TransactionDto>>
{
     private readonly ApplicationDbContext _context;
    private readonly IDistributedCache _cache;
    private readonly ILogger<GetAccountTransactionsHandler> _logger;

    public GetAccountTransactionsHandler(ApplicationDbContext context, IDistributedCache cache, ILogger<GetAccountTransactionsHandler> logger)
    {
        _context = context;
        _cache = cache;
        _logger = logger;
    }

    public async Task<List<TransactionDto>> Handle(GetAccountTransactionsQuery request, CancellationToken cancellationToken)
    {
        // Busca as transações no banco filtrando pela conta do usuário logado
        return await _context.Transactions
            .AsNoTracking() // Melhora a performance em consultas de leitura
            .Where(t => t.AccountId == request.AccountId)
            .OrderByDescending(t => t.CreatedAt) // Mais recentes primeiro
            .Select(t => new TransactionDto(
                t.Id,
                t.Description,
                t.Amount,
                (int)t.Type, // Converte o Enum do C# para int (0 ou 1) para o React
                t.CreatedAt
            ))
            .ToListAsync(cancellationToken);
    }
}