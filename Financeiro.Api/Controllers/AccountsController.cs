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
    public async Task<IActionResult> Create([FromBody] CreateAccountCommand command)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();

        var result = await _mediator.Send(command with { UserId = Guid.Parse(userIdClaim) });
        return Ok(result);
    }


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
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();

        // Em vez de 'command with { AccountId = userId }', 
        // o seu Handler deve ser responsável por achar a conta do usuário logado.
        // Ou, você passa o UserId no comando e o Handler resolve.

        await _mediator.Send(command);
        return Ok();
    }

    // E o GET (que é o que o TransactionList chama) deve estar assim:
    [HttpGet("transactions")] // <--- Verifique se este atributo está correto!
    public async Task<IActionResult> GetTransactions()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();

        var userId = Guid.Parse(userIdClaim);
        var transactions = await _mediator.Send(new GetAccountTransactionsQuery(userId));
        return Ok(transactions);
    }


    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary([FromQuery] int month, [FromQuery] int year)
    {
        // 1. Pega o ID do usuário do Token do Keycloak
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();

        // 2. Se o React não enviar mês/ano (opcional), usamos o mês atual como padrão
        var filterMonth = month == 0 ? DateTime.Now.Month : month;
        var filterYear = year == 0 ? DateTime.Now.Year : year;

        // 3. Envia para o MediatR com os novos campos
        var result = await _mediator.Send(new GetAccountSummaryQuery(
            Guid.Parse(userIdClaim),
            filterMonth,
            filterYear
        ));

        return Ok(result);
    }


}
