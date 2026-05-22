namespace BlushingBlossoms.API.DTOs;

public class UpdateInquiryDto
{
    public string Name { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? InstagramHandle { get; set; }
    public string EventType { get; set; } = string.Empty;
    public string BookingStage { get; set; } = string.Empty;
    public string EventLocation { get; set; } = string.Empty;
    public DateTime EventDate { get; set; }
    public string? ColorPalette { get; set; }
    public string Budget { get; set; } = string.Empty;
    public List<string>? WeddingItems { get; set; }
    public string? RentalsInterest { get; set; }
    public string ReferralSource { get; set; } = string.Empty;
    public decimal? FlowerCost { get; set; }
    public string? FlowerCostItems { get; set; }
    public decimal? BookingAmount { get; set; }
    public List<string>? WorkflowStages { get; set; }
    public string? Notes { get; set; }
    public string? KanbanStage { get; set; }
    public string? PricingData { get; set; }
}
