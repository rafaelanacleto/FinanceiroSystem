using Financeiro.Application.Accounts.Commands;
using Financeiro.Application.Accounts.Queries;
using Financeiro.Application.Transactions.Handlers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Financeiro.Api.Controllers;


[ApiController]
[Route("api/[controller]")]
[Authorize] // <--- Apenas usuários autenticados passam daqui
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

    [HttpGet("{id}/balance")]
    public async Task<IActionResult> GetBalance(Guid id)
    {
        // O MediatR sabe que deve disparar o GetAccountBalanceHandler
        var balance = await _mediator.Send(new GetAccountBalanceQuery(id));
        return Ok(new { AccountId = id, Balance = balance });
    }

    // Este endpoint responde em: POST api/Accounts/transactions
    [HttpPost("transactions")]
    public async Task<IActionResult> PostTransaction([FromBody] CreateTransactionCommand command)
    {
        var transactionId = await _mediator.Send(command);
        return Ok(new { Id = transactionId, Message = "Transação realizada e cache de saldo invalidado." });
    }
}