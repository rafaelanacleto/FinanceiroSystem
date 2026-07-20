using Financeiro.Domain.Entities;
using MediatR;

namespace Financeiro.Application.Notifications.Queries
{
    public class GetNotificationsByUserIdQuery : IRequest<List<NotificationDto>>
    {
        public GetNotificationsByUserIdQuery(Guid userId)
        {
            UserId = userId;
        }

        public Guid UserId { get; }
    }
}