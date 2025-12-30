namespace BlushingBlossoms.API.DTOs;

public class CreateRentalRequestDto
{
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string EventDate { get; set; } = "";
    public string Quantity { get; set; } = "";
    public string Items { get; set; } = "";
    public string Notes { get; set; } = "";
}
