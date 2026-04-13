// Transacao.cs
namespace Financeiro.Domain.Entities;

public class Transaction : BaseEntity
{
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime TransactionDate { get; set; }
    public TransactionType Type { get; set; } // Enum: Income (Receita) ou Expense (Despesa)

    public string Category { get; set; } = string.Empty; // Categoria da transação (ex: Alimentação, Transporte, etc.)

    public Guid AccountId { get; set; }
    public Account Account { get; set; } = null!;
}

public enum TransactionType { Income, Expense }