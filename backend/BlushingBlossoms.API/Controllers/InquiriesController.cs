using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlushingBlossoms.API.DTOs;
using BlushingBlossoms.API.Models;
using BlushingBlossoms.API.Data;
using BlushingBlossoms.API.Services;
using System.Text.Json;

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
        var items = dto.WeddingItems ?? new List<string>();

        // Each counted item that was selected must come with a quantity of at least 1
        var countChecks = new (string Item, int? Count)[]
        {
            ("Bridesmaid Bouquets", dto.BridesmaidBouquetsCount),
            ("Boutonnieres", dto.BoutonnieresCount),
            ("Corsages", dto.CorsagesCount),
            ("Centerpieces", dto.CenterpiecesCount),
        };
        foreach (var (item, count) in countChecks)
        {
            if (items.Contains(item) && (count == null || count < 1))
                return BadRequest(new { message = $"Please enter how many {item.ToLower()} you need." });
        }

        // Only keep counts/details for items that were actually selected
        int? CountIf(string item, int? count) => items.Contains(item) ? count : null;

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
            BridesmaidBouquetsCount = CountIf("Bridesmaid Bouquets", dto.BridesmaidBouquetsCount),
            BoutonnieresCount = CountIf("Boutonnieres", dto.BoutonnieresCount),
            CorsagesCount = CountIf("Corsages", dto.CorsagesCount),
            CenterpiecesCount = CountIf("Centerpieces", dto.CenterpiecesCount),
            InstallationDetails = items.Contains("Installations") && !string.IsNullOrWhiteSpace(dto.InstallationDetails)
                ? dto.InstallationDetails.Trim()
                : null,
            RentalsInterest = dto.RentalsInterest,
            ReferralSource = dto.ReferralSource,
            CreatedAt = DateTime.UtcNow
        };

        _context.Inquiries.Add(inquiry);
        await _context.SaveChangesAsync();

        // 🔔 SEND EMAIL NOTIFICATION
        await _emailService.SendInquiryNotification(
            InquiryEmailBuilder.BuildSubject(inquiry),
            InquiryEmailBuilder.BuildHtml(inquiry),
            InquiryEmailBuilder.BuildText(inquiry),
            replyTo: inquiry.Email);

        return Ok(new { message = "Inquiry received successfully" });
    }

    // ------------------------------------
    // PUT: /api/inquiries/{id}
    // ------------------------------------
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateInquiry(int id, UpdateInquiryDto dto)
    {
        var inquiry = await _context.Inquiries.FindAsync(id);

        if (inquiry == null)
            return NotFound();

        inquiry.Name = dto.Name;
        inquiry.PhoneNumber = dto.PhoneNumber;
        inquiry.Email = dto.Email;
        inquiry.InstagramHandle = dto.InstagramHandle;
        inquiry.EventType = dto.EventType;
        inquiry.BookingStage = dto.BookingStage;
        inquiry.EventLocation = dto.EventLocation;
        inquiry.EventDate = dto.EventDate;
        inquiry.ColorPalette = dto.ColorPalette;
        inquiry.Budget = dto.Budget;
        inquiry.WeddingItems = dto.WeddingItems != null ? string.Join(",", dto.WeddingItems) : null;
        inquiry.BridesmaidBouquetsCount = dto.BridesmaidBouquetsCount;
        inquiry.BoutonnieresCount = dto.BoutonnieresCount;
        inquiry.CorsagesCount = dto.CorsagesCount;
        inquiry.CenterpiecesCount = dto.CenterpiecesCount;
        inquiry.InstallationDetails = dto.InstallationDetails;
        inquiry.RentalsInterest = dto.RentalsInterest;
        inquiry.ReferralSource = dto.ReferralSource;
        inquiry.FlowerCost = dto.FlowerCost;
        inquiry.FlowerCostItems = dto.FlowerCostItems;
        inquiry.BookingAmount = dto.BookingAmount;
        inquiry.WorkflowStages = dto.WorkflowStages != null ? string.Join(",", dto.WorkflowStages) : null;
        inquiry.Notes = dto.Notes;
        if (dto.KanbanStage != null) inquiry.KanbanStage = dto.KanbanStage;
        inquiry.PricingData = dto.PricingData;

        await _context.SaveChangesAsync();

        return Ok(inquiry);
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
