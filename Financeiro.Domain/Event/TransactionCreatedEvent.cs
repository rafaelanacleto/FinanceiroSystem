namespace Financeiro.Domain.Event
{
    public class TransactionCreatedEvent
    {
        public TransactionCreatedEvent(Guid transactionId, Guid accountId, decimal amount, DateTime createdAt)
        {
            TransactionId = transactionId;
            AccountId = accountId;
            Amount = amount;
            CreatedAt = createdAt;
        }

        public Guid TransactionId { get; }
        public Guid AccountId { get; }
        public decimal Amount { get; }
        public DateTime CreatedAt { get; }
    }
}