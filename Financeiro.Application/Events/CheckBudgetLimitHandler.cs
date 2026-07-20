// using Financeiro.Domain.Event;

// namespace Financeiro.Application.Events
// {
//     public class CheckBudgetLimitHandler : INotificationHandler<TransactionCreatedEvent>
//     {
//         private readonly IBudgetRepository _budgetRepository;
//         private readonly IMediator _mediator;

//         public CheckBudgetLimitHandler(IBudgetRepository budgetRepository, IMediator mediator)
//         {
//             _budgetRepository = budgetRepository;
//             _mediator = mediator;
//         }

//         public async Task Handle(TransactionCreatedEvent notification, CancellationToken cancellationToken)
//         {
//             var budgets = await _budgetRepository.GetBudgetsByAccountIdAsync(notification.AccountId);

//             foreach (var budget in budgets)
//             {
//                 if (budget.IsLimitExceeded(notification.Amount))
//                 {
//                     var alertCommand = new CreateBudgetAlertCommand(budget.Id, notification.TransactionId, notification.Amount);
//                     await _mediator.Send(alertCommand, cancellationToken);
//                 }
//             }
//         }
//     }

//     public interface INotificationHandler<T>
//     {
//     }
// }