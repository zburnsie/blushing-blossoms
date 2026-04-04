using Microsoft.AspNetCore.Mvc;
using BlushingBlossoms.API.Services;

namespace BlushingBlossoms.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GalleryController : ControllerBase
{
    private readonly GoogleDriveService _drive;

    public GalleryController(GoogleDriveService drive)
    {
        _drive = drive;
    }

    // GET /api/gallery
    // Returns all wedding folders with their cover image ID, sorted most recent first
    [HttpGet]
    public async Task<IActionResult> GetWeddings()
    {
        var folders = await _drive.GetWeddingFoldersAsync();

        var cards = await Task.WhenAll(folders.Select(async folder =>
        {
            var images = await _drive.GetFolderImagesAsync(folder.Id);
            var cover = images.FirstOrDefault();
            return new
            {
                id = folder.Id,
                name = folder.Name,
                coverImageId = cover?.Id
            };
        }));

        return Ok(cards.Reverse());
    }

    // GET /api/gallery/{folderId}
    // Returns all image IDs for a specific wedding folder
    [HttpGet("{folderId}")]
    public async Task<IActionResult> GetWeddingImages(string folderId)
    {
        var images = await _drive.GetFolderImagesAsync(folderId);
        return Ok(images.Select(f => new { id = f.Id, name = f.Name }));
    }
}
