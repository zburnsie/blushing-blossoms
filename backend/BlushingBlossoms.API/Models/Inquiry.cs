namespace BlushingBlossoms.API.Models;

public class Inquiry
{
    public int Id { get; set; }

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

    public string? WeddingItems { get; set; }
    public int? BridesmaidBouquetsCount { get; set; }
    public int? BoutonnieresCount { get; set; }
    public int? CorsagesCount { get; set; }
    public int? CenterpiecesCount { get; set; }
    public string? InstallationDetails { get; set; }
    public string? RentalsInterest { get; set; }

    public string ReferralSource { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public decimal? FlowerCost { get; set; }
    public string? FlowerCostItems { get; set; }
    public decimal? BookingAmount { get; set; }
    public string? WorkflowStages { get; set; }
    public string? Notes { get; set; }
    public string KanbanStage { get; set; } = "New Lead";
    public string? PricingData { get; set; }
}

