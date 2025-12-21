using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlushingBlossoms.API.DTOs;
using BlushingBlossoms.API.Models;
using BlushingBlossoms.API.Data;

namespace BlushingBlossoms.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InquiriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public InquiriesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: /api/inquiries
    [HttpGet]
    public async Task<IActionResult> GetInquiries()
    {
        var inquiries = await _context.Inquiries
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync();

        return Ok(inquiries);
    }

    // POST: /api/inquiries
    [HttpPost]
    public async Task<IActionResult> CreateInquiry(CreateInquiryDto dto)
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

        _context.Inquiries.Add(inquiry);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Inquiry received successfully" });
    }
}
