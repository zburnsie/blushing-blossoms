using Microsoft.AspNetCore.Mvc;
using BlushingBlossoms.API.DTOs;
using BlushingBlossoms.API.Services;

namespace BlushingBlossoms.API.Controllers;

[ApiController]
[Route("api/rental-requests")]
public class RentalRequestsController : ControllerBase
{
    private readonly EmailService _emailService;

    public RentalRequestsController(EmailService emailService)
    {
        _emailService = emailService;
    }

[HttpPost]
public async Task<IActionResult> CreateRentalRequest(CreateRentalRequestDto dto)
{
    await _emailService.SendRentalRequestNotification($@"
New Rental Request

Name: {dto.Name}
Email: {dto.Email}
Event Date: {dto.EventDate}
Quantity: {dto.Quantity}

Items Requested:
{dto.Items}

Notes:
{dto.Notes}
");

    return Ok();
}

}
