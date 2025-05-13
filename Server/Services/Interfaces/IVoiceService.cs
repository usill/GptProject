namespace TestGptApp.Services.Interfaces
{
    public interface IVoiceService
    {
        public Task<string> VoiceToTextAsync(IFormFile file);
    }
}
