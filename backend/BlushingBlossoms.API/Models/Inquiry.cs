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

    public string ReferralSource { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}

