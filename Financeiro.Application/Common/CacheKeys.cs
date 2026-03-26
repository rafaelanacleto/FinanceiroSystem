namespace Financeiro.Application.Common;

public static class CacheKeys
{
    public static string AccountBalance(Guid accountId) => $"balance_{accountId}";
}
