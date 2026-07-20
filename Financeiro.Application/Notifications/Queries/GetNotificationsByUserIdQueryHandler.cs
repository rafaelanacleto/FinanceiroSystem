using MediatR;
using Microsoft.EntityFrameworkCore;
using Financeiro.Domain.Entities;
using Financeiro.Infrastructure.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Financeiro.Application.Notifications.Queries
{
    public class GetNotificationsByUserIdQueryHandler : IRequestHandler<GetNotificationsByUserIdQuery, List<NotificationDto>>
    {
        private readonly ApplicationDbContext _context;

        public GetNotificationsByUserIdQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<NotificationDto>> Handle(GetNotificationsByUserIdQuery request, CancellationToken cancellationToken)
        {
            var userIdStr = request.UserId.ToString();

            return await _context.Notifications
                .AsNoTracking()
                .Where(n => n.UserId == userIdStr)
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new NotificationDto(
                    n.Id,
                    n.Title,
                    n.Message,
                    n.Type,
                    n.IsRead,
                    n.CreatedAt
                ))
                .ToListAsync(cancellationToken);
        }
    }
}
