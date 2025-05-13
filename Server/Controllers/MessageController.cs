using Microsoft.AspNetCore.Mvc;
using TestGptApp.Models.DTO;
using TestGptApp.Services.Interfaces;

namespace TestGptApp.Controllers
{
    [ApiController]
    [Route("api")]
    public class MessageController : ControllerBase
    {
        private readonly IGptService _gptService;
        private readonly IVoiceService _voiceService;

        public MessageController(IGptService gptService, IVoiceService voiceService)
        {
            _gptService = gptService;
            _voiceService = voiceService;
        }

        [Route("send/text")]
        [HttpPost]
        public async Task<IActionResult> GetTextMessageFromUser([FromForm] TextMessage message)
        {
            SendMessageResult result = await _gptService.SendTextMessageAsync(message.content);

            if (result.Successed == false)
            {
                return Problem("Server error, please try later");
            }

            return Ok(result.Ansver);
        }
        [Route("send/voice")]
        [HttpPost]
        public async Task<IActionResult> GetVoiceMessageFromUser([FromForm] VoiceMessage message)
        {
            IFormFile file = message.content;

            if (file == null || file.Length == 0)
            {
                return BadRequest("Empty file");
            }

            if (file.Length > 400000) // 0.4gb
            {
                return BadRequest("File is very large");
            }

            string textResult = await _voiceService.VoiceToTextAsync(file);

            return Ok(textResult);
        }
        //
    }
}
