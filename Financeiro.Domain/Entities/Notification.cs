
namespace Financeiro.Domain.Entities;

public class Notification
{
    public Guid Id { get; set; }
    public string UserId { get; set; } = string.Empty; // ID vindo do Keycloak
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // "Alert" | "Success" | "Info"
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
}

public record NotificationDto(Guid Id, string Title, string Message, string Type, bool IsRead, DateTime CreatedAt);