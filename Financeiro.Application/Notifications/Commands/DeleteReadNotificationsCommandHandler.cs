using MediatR;
using Microsoft.EntityFrameworkCore;
using Financeiro.Infrastructure.Data;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Financeiro.Application.Notifications.Commands
{
    public class DeleteReadNotificationsCommandHandler : IRequestHandler<DeleteReadNotificationsCommand>
    {
        private readonly ApplicationDbContext _context;

        public DeleteReadNotificationsCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task Handle(DeleteReadNotificationsCommand request, CancellationToken cancellationToken)
        {
            var userIdStr = request.UserId.ToString();

            var notifications = await _context.Notifications
                .Where(n => n.UserId == userIdStr && n.IsRead)
                .ToListAsync(cancellationToken);

            if (notifications.Count == 0)
                return;

            _context.Notifications.RemoveRange(notifications);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
