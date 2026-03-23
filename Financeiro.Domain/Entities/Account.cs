// Conta.cs
namespace Financeiro.Domain.Entities;
public class Account : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Balance { get; private set; }
    public string Currency { get; set; } = "BRL";
    
    // Relacionamento com o usuário do Keycloak (Subject ID)
    public Guid UserId { get; set; } 

    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}