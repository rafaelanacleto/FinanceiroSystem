using MediatR;
using System;

namespace Financeiro.Application.Notifications.Commands
{
    public record DeleteReadNotificationsCommand(Guid UserId) : IRequest;
}
