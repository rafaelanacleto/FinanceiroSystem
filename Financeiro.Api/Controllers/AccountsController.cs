using Financeiro.Application.Accounts.Commands;
using Financeiro.Application.Accounts.Queries;
using Financeiro.Application.Transactions.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Financeiro.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AccountsController : ControllerBase
{
    private readonly IMediator _mediator;

    public AccountsController(IMediator mediator) => _mediator = mediator;

    [HttpPost]
    public async Task<IActionResult> Create(CreateAccountCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    // [HttpGet("{id}/balance")]
    // public async Task<IActionResult> GetBalance(Guid id)
    // {
    //     var balance = await _mediator.Send(new GetAccountBalanceQuery(id));
    //     return Ok(new { AccountId = id, Balance = balance });
    // }

    [HttpGet("balance")] // Removido o {id} da rota
    [Authorize]
    public async Task<IActionResult> GetBalance()
    {
        // Pega o Subject (ID) do usuário logado no Token
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();

        var userId = Guid.Parse(userIdClaim);
        var balance = await _mediator.Send(new GetAccountBalanceQuery(userId));

        // IMPORTANTE: Verifique se o seu JSON retorna 'amount' ou 'Balance'
        return Ok(new { amount = balance });
    }

    [HttpPost("transactions")]
    public async Task<IActionResult> PostTransaction([FromBody] CreateTransactionCommand command)
    {
        var transactionId = await _mediator.Send(command);
        return Ok(new { Id = transactionId });
    }
}
