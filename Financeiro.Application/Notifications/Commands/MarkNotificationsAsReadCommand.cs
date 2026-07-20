namespace financeiro.Application.Notifications.Commands
{
    public class MarkNotificationsAsReadCommand
    {
        public MarkNotificationsAsReadCommand(List<Guid> notificationIds)
        {
            NotificationIds = notificationIds;
        }

        public List<Guid> NotificationIds { get; }
    }
}