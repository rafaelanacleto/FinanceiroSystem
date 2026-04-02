using Financeiro.Application.Common.Interfaces;
using System.Security.Claims;

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
        => _httpContextAccessor.HttpContext?.User.FindFirst("name")?.Value
           ?? _httpContextAccessor.HttpContext?.User.FindFirst(System.Security.Claims.ClaimTypes.GivenName)?.Value
           ?? "Usuário";
}