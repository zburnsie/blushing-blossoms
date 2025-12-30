using System.Net;
using System.Net.Mail;

namespace BlushingBlossoms.API.Services;

public class EmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    // -----------------------------
    // Inquiry email (EXISTING)
    // -----------------------------
    public async Task SendInquiryNotification(string body)
    {
        var emailSettings = _config.GetSection("Email");

        var smtpClient = new SmtpClient(emailSettings["SmtpServer"])
        {
            Port = int.Parse(emailSettings["Port"]!),
            Credentials = new NetworkCredential(
                emailSettings["Username"],
                emailSettings["Password"]
            ),
            EnableSsl = true
        };

        var mailMessage = new MailMessage
        {
            From = new MailAddress(emailSettings["From"]!),
            Subject = "🌸 New Blushing Blossoms Inquiry",
            Body = body,
            IsBodyHtml = false
        };

        foreach (var email in emailSettings["To"]!.Split(','))
        {
            mailMessage.To.Add(email.Trim());
        }

        await smtpClient.SendMailAsync(mailMessage);
    }

    // -----------------------------
    // Rental request email (NEW)
    // -----------------------------
    public async Task SendRentalRequestNotification(string body)
    {
        var emailSettings = _config.GetSection("Email");

        var smtpClient = new SmtpClient(emailSettings["SmtpServer"])
        {
            Port = int.Parse(emailSettings["Port"]!),
            Credentials = new NetworkCredential(
                emailSettings["Username"],
                emailSettings["Password"]
            ),
            EnableSsl = true
        };

        var mailMessage = new MailMessage
        {
            From = new MailAddress(emailSettings["From"]!),
            Subject = "📦 New Rental Request",
            Body = body,
            IsBodyHtml = false
        };

        foreach (var email in emailSettings["To"]!.Split(','))
        {
            mailMessage.To.Add(email.Trim());
        }

        await smtpClient.SendMailAsync(mailMessage);
    }
}
