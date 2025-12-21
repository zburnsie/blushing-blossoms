using Microsoft.EntityFrameworkCore;
using BlushingBlossoms.API.Models;

namespace BlushingBlossoms.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Inquiry> Inquiries => Set<Inquiry>();
}
