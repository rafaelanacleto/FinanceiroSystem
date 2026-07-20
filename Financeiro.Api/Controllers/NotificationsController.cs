using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Financeiro.Application.Notifications.Queries;
using Financeiro.Application.Notifications.Commands;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Financeiro.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public NotificationsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetNotifications()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();

            if (!Guid.TryParse(userIdClaim, out var userId))
                return BadRequest("ID de usuário inválido.");

            var query = new GetNotificationsByUserIdQuery(userId);
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpPut("read")]
        public async Task<IActionResult> MarkAsRead([FromBody] List<Guid> notificationIds)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();

            var command = new MarkNotificationsAsReadCommand(notificationIds);
            await _mediator.Send(command);
            return Ok();
        }
    }
}
