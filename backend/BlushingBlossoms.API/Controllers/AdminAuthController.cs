using Microsoft.AspNetCore.Mvc;

namespace BlushingBlossoms.API.Controllers;

[ApiController]
[Route("api/admin-auth")]
public class AdminAuthController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public AdminAuthController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] AdminLoginRequest request)
    {
        var adminPassword = _configuration["Admin:Password"];

        if (request.Password == adminPassword)
        {
            return Ok(new { success = true });
        }

        return Unauthorized(new { success = false });
    }
}

public class AdminLoginRequest
{
    public string Password { get; set; } = string.Empty;
}
