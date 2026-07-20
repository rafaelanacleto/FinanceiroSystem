using MediatR;
using System;
using System.Collections.Generic;

namespace Financeiro.Application.Notifications.Commands
{
    public record MarkNotificationsAsReadCommand(List<Guid> NotificationIds) : IRequest;
}