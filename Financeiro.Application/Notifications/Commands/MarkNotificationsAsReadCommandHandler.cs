using MediatR;
using Microsoft.EntityFrameworkCore;
using Financeiro.Infrastructure.Data;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Financeiro.Application.Notifications.Commands
{
    public class MarkNotificationsAsReadCommandHandler : IRequestHandler<MarkNotificationsAsReadCommand>
    {
        private readonly ApplicationDbContext _context;

        public MarkNotificationsAsReadCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task Handle(MarkNotificationsAsReadCommand request, CancellationToken cancellationToken)
        {
            if (request.NotificationIds == null || !request.NotificationIds.Any())
                return;

            var notifications = await _context.Notifications
                .Where(n => request.NotificationIds.Contains(n.Id))
                .ToListAsync(cancellationToken);

            foreach (var notification in notifications)
            {
                notification.IsRead = true;
            }

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
