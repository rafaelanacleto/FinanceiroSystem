using MediatR;

namespace Financeiro.Application.Accounts.Commands;
//(O DTO de entrada)
public record CreateAccountCommand(
    string Name, 
    string Description, 
    string Currency, 
    Guid UserId) : IRequest<Guid>;