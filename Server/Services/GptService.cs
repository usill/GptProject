using Microsoft.AspNetCore.Http.HttpResults;
using System.Net;
using System.Text.Json;
using TestGptApp.Models;
using TestGptApp.Models.DTO;
using TestGptApp.Services.Interfaces;

namespace TestGptApp.Services
{
    public class GptService : IGptService
    {
        private readonly string _openAIKey;
        public GptService(IConfiguration configuration)
        {
            _openAIKey = configuration.GetSection("Gpt:ApiKey").Get<string>();
        }

        public async Task<SendMessageResult> SendTextMessageAsync(string text)
        {
            var httpHandler = new HttpClientHandler()
            {
                Proxy = new WebProxy("socks5://127.0.0.1:12334"),
                UseProxy = true
            };

            var http = new HttpClient(httpHandler);

            http.DefaultRequestHeaders.Add("Accept", "application/json");
            http.DefaultRequestHeaders.Add("Authorization", "Bearer " + _openAIKey);

            try
            {
                var responce = await http.PostAsJsonAsync("https://api.openai.com/v1/chat/completions", new GptRequest
                {
                    model = "gpt-4o-mini",
                    store = true,
                    messages = [new GptMessage {
                    role = "user",
                    content = text,
                }]
                });

                string data = await responce.Content.ReadAsStringAsync();
                GptResponse? result = JsonSerializer.Deserialize<GptResponse>(data);

                return new SendMessageResult
                {
                    Successed = true,
                    Ansver = result.choices[0].message.content
                };
            }
            catch(Exception e)
            {
                // add log writing here
                return new SendMessageResult 
                { 
                    Successed = false,
                };
            }
        }
    }
}
