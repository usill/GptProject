namespace TestGptApp.Models.DTO
{
    public class GptRequest
    {
        public string model { get; set; }
        public GptMessage[] messages { get; set; }
        public bool store { get; set; }
    }
}
