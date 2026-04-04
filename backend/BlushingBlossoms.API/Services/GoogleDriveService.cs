using Microsoft.Extensions.Caching.Memory;
using System.Text.Json;

namespace BlushingBlossoms.API.Services;

public record DriveFolder(string Id, string Name);
public record DriveFile(string Id, string Name);

public class GoogleDriveService
{
    private readonly IHttpClientFactory _httpFactory;
    private readonly IMemoryCache _cache;
    private readonly string _apiKey;
    private readonly string _rootFolderId;
    private static readonly TimeSpan CacheDuration = TimeSpan.FromHours(1);
    private const string Base = "https://www.googleapis.com/drive/v3/files";

    public GoogleDriveService(IHttpClientFactory httpFactory, IMemoryCache cache, IConfiguration config)
    {
        _httpFactory = httpFactory;
        _cache = cache;
        _apiKey = config["GoogleDrive:ApiKey"]!;
        _rootFolderId = config["GoogleDrive:RootFolderId"]!;
    }

    public async Task<List<DriveFolder>> GetWeddingFoldersAsync()
    {
        return await _cache.GetOrCreateAsync("gallery:folders", async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = CacheDuration;

            var query = Uri.EscapeDataString(
                $"'{_rootFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false"
            );
            var url = $"{Base}?q={query}&fields=files(id,name)&orderBy=name&key={_apiKey}";

            var http = _httpFactory.CreateClient();
            var json = await http.GetStringAsync(url);
            using var doc = JsonDocument.Parse(json);
            var files = doc.RootElement.GetProperty("files");

            return files.EnumerateArray()
                .Select(f => new DriveFolder(f.GetProperty("id").GetString()!, f.GetProperty("name").GetString()!))
                .ToList();
        }) ?? [];
    }

    public async Task<List<DriveFile>> GetFolderImagesAsync(string folderId)
    {
        return await _cache.GetOrCreateAsync($"gallery:folder:{folderId}", async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = CacheDuration;

            var query = Uri.EscapeDataString(
                $"'{folderId}' in parents and mimeType contains 'image/' and trashed=false"
            );
            var url = $"{Base}?q={query}&fields=files(id,name)&orderBy=name&key={_apiKey}";

            var http = _httpFactory.CreateClient();
            var json = await http.GetStringAsync(url);
            using var doc = JsonDocument.Parse(json);
            var files = doc.RootElement.GetProperty("files");

            return files.EnumerateArray()
                .Select(f => new DriveFile(f.GetProperty("id").GetString()!, f.GetProperty("name").GetString()!))
                .ToList();
        }) ?? [];
    }
}
