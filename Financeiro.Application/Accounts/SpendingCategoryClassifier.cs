namespace Financeiro.Application.Accounts;

// Classifica categorias de despesa como essenciais ou supérfluas para o "Perfil de Gastos".
public static class SpendingCategoryClassifier
{
    private static readonly HashSet<string> EssentialCategories = new(StringComparer.OrdinalIgnoreCase)
    {
        "Moradia",
        "Alimentação",
        "Transporte",
        "Saúde",
        "Educação",
        "Contas Fixas",
        "Impostos",
        "Empréstimos",
    };

    public static bool IsEssential(string category) => EssentialCategories.Contains(category);
}
