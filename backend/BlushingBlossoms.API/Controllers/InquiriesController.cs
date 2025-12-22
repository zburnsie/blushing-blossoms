using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlushingBlossoms.API.DTOs;
using BlushingBlossoms.API.Models;
using BlushingBlossoms.API.Data;
using BlushingBlossoms.API.Services;

namespace BlushingBlossoms.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InquiriesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly EmailService _emailService;

    public InquiriesController(AppDbContext context, EmailService emailService)
    {
        _context = context;
        _emailService = emailService;
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

        // 🔔 SEND EMAIL NOTIFICATION
        await _emailService.SendInquiryNotification($@"
        New Blushing Blossoms Inquiry

        Name: {inquiry.Name}
        Email: {inquiry.Email}
        Phone: {inquiry.PhoneNumber}
        Event Type: {inquiry.EventType}
        Event Date: {inquiry.EventDate:d}
        Budget: {inquiry.Budget}
        Referral Source: {inquiry.ReferralSource}
");

        return Ok(new { message = "Inquiry received successfully" });
    }

        // ------------------------------------
    // DELETE: /api/inquiries/{id}
    // ------------------------------------
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteInquiry(int id)
    {
        var inquiry = await _context.Inquiries.FindAsync(id);

        if (inquiry == null)
        {
            return NotFound();
        }

        _context.Inquiries.Remove(inquiry);
        await _context.SaveChangesAsync();

        return NoContent();
    }

}
