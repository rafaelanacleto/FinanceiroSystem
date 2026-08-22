using Financeiro.Application.Common.Interfaces;
using System.Security.Claims;
using System.Text.Json;

namespace Financeiro.Api;

public class UserService : IUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string GetUserId()
        => _httpContextAccessor.HttpContext?.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

    public string GetUserName()
    {
        var user = _httpContextAccessor.HttpContext?.User;

        // Supabase carrega o nome dentro da claim "user_metadata" (objeto JSON), não como claim solta
        var userMetadataJson = user?.FindFirst("user_metadata")?.Value;
        if (!string.IsNullOrEmpty(userMetadataJson))
        {
            try
            {
                using var metadata = JsonDocument.Parse(userMetadataJson);
                if (metadata.RootElement.TryGetProperty("full_name", out var fullName))
                    return fullName.GetString() ?? "Usuário";
                if (metadata.RootElement.TryGetProperty("name", out var name))
                    return name.GetString() ?? "Usuário";
            }
            catch (JsonException)
            {
                // ignora metadata malformada e cai no fallback abaixo
            }
        }

        return user?.FindFirst("email")?.Value ?? "Usuário";
    }
}