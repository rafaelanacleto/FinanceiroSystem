using Microsoft.EntityFrameworkCore;
using Financeiro.Domain.Entities;

namespace Financeiro.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<Transaction> Transactions => Set<Transaction>();

    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<UserPreference> UserPreferences => Set<UserPreference>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Fluent API para precisão decimal financeira
        modelBuilder.Entity<Account>()
            .Property(a => a.Balance)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Transaction>()
            .Property(t => t.Amount)
            .HasPrecision(18, 2);

        modelBuilder.Entity<UserPreference>()
            .Property(p => p.MonthlySavingsGoal)
            .HasPrecision(18, 2);

        modelBuilder.Entity<UserPreference>()
            .HasIndex(p => p.UserId)
            .IsUnique();

        base.OnModelCreating(modelBuilder);
    }
}