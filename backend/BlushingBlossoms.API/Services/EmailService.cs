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
    // Inquiry email (HTML, with plain-text fallback)
    // -----------------------------
    public async Task SendInquiryNotification(string subject, string htmlBody, string textBody, string? replyTo)
    {
        var emailSettings = _config.GetSection("Email");

        using var smtpClient = new SmtpClient(emailSettings["SmtpServer"])
        {
            Port = int.Parse(emailSettings["Port"]!),
            Credentials = new NetworkCredential(
                emailSettings["Username"],
                emailSettings["Password"]
            ),
            EnableSsl = true
        };

        using var mailMessage = new MailMessage
        {
            From = new MailAddress(emailSettings["From"]!, "Blushing Blossoms"),
            Subject = subject,
            Body = textBody,
            IsBodyHtml = false
        };
        mailMessage.AlternateViews.Add(
            AlternateView.CreateAlternateViewFromString(htmlBody, System.Text.Encoding.UTF8, "text/html"));

        // Hitting "Reply" in the inbox goes straight to the client
        if (!string.IsNullOrWhiteSpace(replyTo))
        {
            try { mailMessage.ReplyToList.Add(new MailAddress(replyTo.Trim())); }
            catch (FormatException) { /* invalid client email — skip Reply-To */ }
        }

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
