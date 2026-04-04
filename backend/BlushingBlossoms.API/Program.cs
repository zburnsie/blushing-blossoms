using BlushingBlossoms.API.Data;
using Microsoft.EntityFrameworkCore;
using BlushingBlossoms.API.Services;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddScoped<EmailService>();
builder.Services.AddMemoryCache();
builder.Services.AddHttpClient();
builder.Services.AddSingleton<GoogleDriveService>();


// 🔹 DbContext (THIS WAS MISSING)
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlite("Data Source=blushingblossoms.db");
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS (allow React frontend)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Enable CORS BEFORE controllers
app.UseCors("AllowFrontend");

app.UseAuthorization();

// Map controllers
app.MapControllers();

// Pre-warm the gallery cache on startup so no visitor ever hits a cold cache
_ = Task.Run(async () =>
{
    try
    {
        var drive = app.Services.GetRequiredService<GoogleDriveService>();
        var folders = await drive.GetWeddingFoldersAsync();
        await Task.WhenAll(folders.Select(f => drive.GetFolderImagesAsync(f.Id)));
    }
    catch
    {
        // Non-critical — cache will populate on first request instead
    }
});

app.Run();
