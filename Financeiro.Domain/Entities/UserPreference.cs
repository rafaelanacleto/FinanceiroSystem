namespace Financeiro.Domain.Entities;

public class UserPreference : BaseEntity
{
    public const decimal DefaultMonthlySavingsGoal = 5000m;

    public Guid UserId { get; set; }
    public decimal MonthlySavingsGoal { get; set; } = DefaultMonthlySavingsGoal;
}
