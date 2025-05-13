using TestGptApp.Models.DTO;

namespace TestGptApp.Services.Interfaces
{
    public interface IGptService
    {
        public Task<SendMessageResult> SendTextMessageAsync(string text);
    }
}
