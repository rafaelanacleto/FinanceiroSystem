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

    [HttpGet("{id}/balance")]
    public async Task<IActionResult> GetBalance(Guid id)
    {
        var balance = await _mediator.Send(new GetAccountBalanceQuery(id));
        return Ok(new { AccountId = id, Balance = balance });
    }

    [HttpPost("transactions")]
    public async Task<IActionResult> PostTransaction([FromBody] CreateTransactionCommand command)
    {
        var transactionId = await _mediator.Send(command);
        return Ok(new { Id = transactionId });
    }
}
