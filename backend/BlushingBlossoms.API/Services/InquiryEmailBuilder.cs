using System.Globalization;
using System.Net;
using System.Text;
using BlushingBlossoms.API.Models;

namespace BlushingBlossoms.API.Services;

/// <summary>
/// Builds the "new inquiry" notification email (HTML + plain-text fallback).
/// Styling is inline + table-based so it renders consistently in Gmail / Apple Mail / Outlook.
/// </summary>
public static class InquiryEmailBuilder
{
    // Brand palette (matches the website)
    private const string Cream = "#FFF9F2";
    private const string Blush = "#F5EDE5";
    private const string Rose = "#844F4F";
    private const string Sand = "#E8DDD4";
    private const string Ink = "#2B2B2B";
    private const string Muted = "#8C6A5A";
    private const string Serif = "'Fraunces', Georgia, 'Times New Roman', serif";
    private const string Sans = "-apple-system, 'Helvetica Neue', Helvetica, Arial, sans-serif";

    private static readonly (string Item, Func<Inquiry, int?> Count)[] CountedItems =
    {
        ("Bridesmaid Bouquets", i => i.BridesmaidBouquetsCount),
        ("Boutonnieres", i => i.BoutonnieresCount),
        ("Corsages", i => i.CorsagesCount),
        ("Centerpieces", i => i.CenterpiecesCount),
    };

    private static readonly CultureInfo Us = CultureInfo.GetCultureInfo("en-US");

    public static string BuildSubject(Inquiry inq) =>
        $"🌸 New Blushing Blossoms Inquiry — {inq.Name} · {inq.EventDate.ToString("MMM d, yyyy", Us)}";

    // ─────────────────────────────────────────────────────────────
    // HTML
    // ─────────────────────────────────────────────────────────────
    public static string BuildHtml(Inquiry inq)
    {
        var name = H(inq.Name);
        var firstName = H(inq.Name.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries).FirstOrDefault() ?? inq.Name);
        var eventDate = inq.EventDate.ToString("dddd, MMMM d, yyyy", Us);
        var countdown = Countdown(inq.EventDate);

        var sb = new StringBuilder();
        sb.Append($$"""
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:{{Blush}};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:{{Blush}};padding:28px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:{{Cream}};border:1px solid {{Sand}};border-radius:14px;overflow:hidden;">

  <!-- Header -->
  <tr><td align="center" style="padding:34px 28px 8px;">
    <div style="font-size:22px;letter-spacing:10px;color:{{Rose}};">✿ ❀ ✿</div>
    <div style="font-family:{{Sans}};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:{{Muted}};margin-top:14px;">New Inquiry</div>
    <div style="font-family:{{Serif}};font-size:34px;line-height:1.2;color:{{Ink}};margin-top:6px;">{{name}}</div>
    <div style="font-family:{{Serif}};font-size:16px;color:{{Rose}};margin-top:10px;font-style:italic;">
      {{H(inq.EventType)}} · {{eventDate}}
    </div>
    <div style="font-family:{{Sans}};font-size:13px;color:{{Muted}};margin-top:4px;">📍 {{H(inq.EventLocation)}}{{(countdown != null ? $" &nbsp;·&nbsp; {countdown}" : "")}}</div>
  </td></tr>

  <!-- At a glance -->
  <tr><td style="padding:22px 24px 6px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      {{Tile("Budget", FormatBudget(inq.Budget))}}
      <td width="10"></td>
      {{Tile("Booking Stage", H(inq.BookingStage))}}
      <td width="10"></td>
      {{Tile("Rentals", YesNo(inq.RentalsInterest))}}
    </tr></table>
  </td></tr>

""");

        // Flower order
        var items = SplitItems(inq.WeddingItems);
        if (items.Count > 0)
        {
            sb.Append(SectionHeading("The Flowers"));
            sb.Append($"""<tr><td style="padding:0 28px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">""");
            foreach (var item in items)
            {
                var count = CountedItems.FirstOrDefault(c => c.Item == item).Count?.Invoke(inq);
                var badge = count != null
                    ? $"""<span style="display:inline-block;min-width:22px;padding:3px 10px;border-radius:999px;background:{Rose};color:#fff;font-family:{Sans};font-size:13px;font-weight:600;text-align:center;">× {count}</span>"""
                    : $"""<span style="color:{Rose};font-size:16px;">✓</span>""";
                sb.Append($"""
<tr>
  <td style="padding:10px 0;border-bottom:1px dashed {Sand};font-family:{Serif};font-size:16px;color:{Ink};">🌷&nbsp; {H(item)}</td>
  <td align="right" style="padding:10px 0;border-bottom:1px dashed {Sand};">{badge}</td>
</tr>
""");
            }
            sb.Append("</table></td></tr>");

            if (items.Contains("Installations"))
            {
                var details = string.IsNullOrWhiteSpace(inq.InstallationDetails)
                    ? $"""<span style="color:{Muted};">Not sure yet — no details given.</span>"""
                    : H(inq.InstallationDetails).Replace("\n", "<br>");
                sb.Append($"""
<tr><td style="padding:14px 28px 0;">
  <div style="background:#fff;border-left:3px solid {Rose};border-radius:6px;padding:12px 16px;">
    <div style="font-family:{Sans};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:{Muted};margin-bottom:6px;">Installation Ideas</div>
    <div style="font-family:{Serif};font-size:15px;line-height:1.5;color:{Ink};font-style:italic;">“{details}”</div>
  </div>
</td></tr>
""");
            }
        }

        // Event details
        sb.Append(SectionHeading("The Details"));
        sb.Append($"""<tr><td style="padding:0 28px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">""");
        sb.Append(DetailRow("Color Palette", Val(inq.ColorPalette)));
        sb.Append(DetailRow("Heard About Us", Val(inq.ReferralSource)));
        sb.Append("</table></td></tr>");

        // Contact
        sb.Append(SectionHeading("Get in Touch"));
        sb.Append($"""<tr><td style="padding:0 28px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">""");
        sb.Append(DetailRow("Email", $"""<a href="mailto:{H(inq.Email)}" style="color:{Rose};">{H(inq.Email)}</a>"""));
        sb.Append(DetailRow("Phone", $"""<a href="tel:{H(DigitsOnly(inq.PhoneNumber))}" style="color:{Rose};">{H(inq.PhoneNumber)}</a>"""));
        var ig = InstagramHandle(inq.InstagramHandle);
        sb.Append(DetailRow("Instagram", ig == null
            ? Val(null)
            : $"""<a href="https://instagram.com/{H(ig)}" style="color:{Rose};">@{H(ig)}</a>"""));
        sb.Append("</table></td></tr>");

        // Buttons
        var replySubject = Uri.EscapeDataString($"Your Blushing Blossoms inquiry 🌸");
        sb.Append($"""
<tr><td align="center" style="padding:28px 24px 8px;">
  <a href="mailto:{H(inq.Email)}?subject={replySubject}" style="display:inline-block;background:{Rose};color:#fff;text-decoration:none;font-family:{Sans};font-size:14px;font-weight:600;padding:12px 26px;border-radius:999px;margin:4px;">Reply to {firstName}</a>
  <a href="tel:{H(DigitsOnly(inq.PhoneNumber))}" style="display:inline-block;background:#fff;color:{Rose};border:1px solid {Rose};text-decoration:none;font-family:{Sans};font-size:14px;font-weight:600;padding:11px 26px;border-radius:999px;margin:4px;">Call</a>
</td></tr>
""");

        // Footer
        sb.Append($"""
<tr><td align="center" style="padding:22px 28px 30px;">
  <div style="font-size:14px;letter-spacing:8px;color:{Sand};">❀ ❀ ❀</div>
  <div style="font-family:{Sans};font-size:12px;color:{Muted};margin-top:10px;">Received {H(FormatReceived(inq.CreatedAt))} · Inquiry #{inq.Id}</div>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>
""");
        return sb.ToString();
    }

    // ─────────────────────────────────────────────────────────────
    // Plain text fallback
    // ─────────────────────────────────────────────────────────────
    public static string BuildText(Inquiry inq)
    {
        var sb = new StringBuilder();
        sb.AppendLine("✿ ❀ ✿  NEW BLUSHING BLOSSOMS INQUIRY  ✿ ❀ ✿");
        sb.AppendLine();
        sb.AppendLine(inq.Name);
        sb.AppendLine($"{inq.EventType} · {inq.EventDate.ToString("dddd, MMMM d, yyyy", Us)}");
        sb.AppendLine($"Location: {inq.EventLocation}");
        sb.AppendLine();
        sb.AppendLine($"Budget: {FormatBudget(inq.Budget)}");
        sb.AppendLine($"Booking Stage: {inq.BookingStage}");
        sb.AppendLine($"Rentals: {YesNo(inq.RentalsInterest)}");

        var items = SplitItems(inq.WeddingItems);
        if (items.Count > 0)
        {
            sb.AppendLine();
            sb.AppendLine("THE FLOWERS");
            foreach (var item in items)
            {
                var count = CountedItems.FirstOrDefault(c => c.Item == item).Count?.Invoke(inq);
                sb.AppendLine(count != null ? $"  • {item} × {count}" : $"  • {item}");
            }
            if (items.Contains("Installations"))
                sb.AppendLine($"  Installation ideas: {(string.IsNullOrWhiteSpace(inq.InstallationDetails) ? "Not sure yet" : inq.InstallationDetails)}");
        }

        sb.AppendLine();
        sb.AppendLine($"Color Palette: {TextVal(inq.ColorPalette)}");
        sb.AppendLine($"Heard About Us: {TextVal(inq.ReferralSource)}");
        sb.AppendLine();
        sb.AppendLine("CONTACT");
        sb.AppendLine($"  Email: {inq.Email}");
        sb.AppendLine($"  Phone: {inq.PhoneNumber}");
        var ig = InstagramHandle(inq.InstagramHandle);
        sb.AppendLine($"  Instagram: {(ig != null ? "@" + ig : "—")}");
        sb.AppendLine();
        sb.AppendLine($"Received {FormatReceived(inq.CreatedAt)} · Inquiry #{inq.Id}");
        return sb.ToString();
    }

    // ─────────────────────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────────────────────
    private static string H(string? s) => WebUtility.HtmlEncode(s ?? "");

    private static string Val(string? s) =>
        string.IsNullOrWhiteSpace(s) ? $"""<span style="color:{Muted};">—</span>""" : H(s);

    private static string TextVal(string? s) => string.IsNullOrWhiteSpace(s) ? "—" : s;

    private static string Tile(string label, string value) => $"""
<td width="33%" valign="top" style="background:#fff;border:1px solid {Sand};border-radius:10px;padding:14px 10px;text-align:center;">
  <div style="font-family:{Sans};font-size:10px;letter-spacing:2px;text-transform:uppercase;color:{Muted};">{label}</div>
  <div style="font-family:{Serif};font-size:17px;color:{Ink};margin-top:6px;">{value}</div>
</td>
""";

    private static string SectionHeading(string title) => $"""
<tr><td style="padding:26px 28px 6px;">
  <div style="font-family:{Serif};font-size:20px;color:{Rose};">{title}</div>
  <div style="height:1px;background:{Sand};margin-top:8px;line-height:1px;font-size:1px;">&nbsp;</div>
</td></tr>
""";

    private static string DetailRow(string label, string valueHtml) => $"""
<tr>
  <td width="38%" style="padding:8px 0;font-family:{Sans};font-size:12px;letter-spacing:1px;text-transform:uppercase;color:{Muted};vertical-align:top;">{label}</td>
  <td style="padding:8px 0;font-family:{Serif};font-size:15px;color:{Ink};">{valueHtml}</td>
</tr>
""";

    private static List<string> SplitItems(string? items) =>
        string.IsNullOrWhiteSpace(items)
            ? new List<string>()
            : items.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToList();

    private static string YesNo(string? v) => v?.ToLowerInvariant() switch
    {
        "yes" => "Yes",
        "no" => "No",
        _ => "—",
    };

    /// "5000-7000" → "$5,000 – $7,000", "7000+" → "$7,000+", "other" → "Other"
    private static string FormatBudget(string budget)
    {
        if (string.IsNullOrWhiteSpace(budget)) return "—";
        if (budget.Equals("other", StringComparison.OrdinalIgnoreCase)) return "Other";
        static string Money(string n) => decimal.TryParse(n, out var d) ? d.ToString("$#,0", Us) : n;
        if (budget.EndsWith('+')) return Money(budget.TrimEnd('+')) + "+";
        var parts = budget.Split('-');
        return parts.Length == 2 ? $"{Money(parts[0])} – {Money(parts[1])}" : budget;
    }

    private static string? InstagramHandle(string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw)) return null;
        var handle = raw.Trim().TrimStart('@');
        // Accept pasted profile URLs too
        var idx = handle.IndexOf("instagram.com/", StringComparison.OrdinalIgnoreCase);
        if (idx >= 0) handle = handle[(idx + "instagram.com/".Length)..].Split('/', '?')[0];
        return handle.Length > 0 ? handle : null;
    }

    private static string DigitsOnly(string phone) => new(phone.Where(c => char.IsDigit(c) || c == '+').ToArray());

    private static TimeZoneInfo Mountain()
    {
        try { return TimeZoneInfo.FindSystemTimeZoneById("America/Denver"); }
        catch { return TimeZoneInfo.Utc; }
    }

    private static string? Countdown(DateTime eventDate)
    {
        var today = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, Mountain()).Date;
        var days = (eventDate.Date - today).Days;
        if (days < 0) return "date has passed";
        if (days == 0) return "today!";
        if (days < 60) return $"{days} day{(days == 1 ? "" : "s")} away";
        var months = (int)Math.Round(days / 30.44);
        return $"about {months} months away";
    }

    private static string FormatReceived(DateTime createdUtc)
    {
        var local = TimeZoneInfo.ConvertTimeFromUtc(DateTime.SpecifyKind(createdUtc, DateTimeKind.Utc), Mountain());
        return local.ToString("MMM d, yyyy 'at' h:mm tt", Us);
    }
}
