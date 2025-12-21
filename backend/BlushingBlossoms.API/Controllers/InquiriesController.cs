using Microsoft.AspNetCore.Mvc;
using BlushingBlossoms.API.DTOs;
using BlushingBlossoms.API.Models;

namespace BlushingBlossoms.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InquiriesController : ControllerBase
{
    [HttpPost]
    public IActionResult CreateInquiry(CreateInquiryDto dto)
    {
        var inquiry = new Inquiry
        {
            Name = dto.Name,
            PhoneNumber = dto.PhoneNumber,
            Email = dto.Email,
            InstagramHandle = dto.InstagramHandle,
            EventType = dto.EventType,
            BookingStage = dto.BookingStage,
            EventLocation = dto.EventLocation,
            EventDate = dto.EventDate,
            ColorPalette = dto.ColorPalette,
            Budget = dto.Budget,
            WeddingItems = dto.WeddingItems != null
                ? string.Join(",", dto.WeddingItems)
                : null,
            ReferralSource = dto.ReferralSource,
            CreatedAt = DateTime.UtcNow
        };

        // For now, just return success
        return Ok(new { message = "Inquiry received successfully" });
    }
}

