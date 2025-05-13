using NAudio.Wave;
using System.Text.Json;
using TestGptApp.Services.Interfaces;
using Vosk;

namespace TestGptApp.Services
{
    public class VoiceService : IVoiceService
    {
        private readonly VoskRecognizer _recognizer;
        public VoiceService()
        {
            string modelPath = Path.Combine(Directory.GetCurrentDirectory(), "VoiceModels", "vosk-model-en-us-0.22-lgraph");
            Model model = new Model(modelPath);
            _recognizer = new VoskRecognizer(model, 16000.0f);
            _recognizer.SetMaxAlternatives(0);
            _recognizer.SetWords(true);
        }
        public async Task<string> VoiceToTextAsync(IFormFile file)
        {
            string result;

            byte[] audioBytes;
            await using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                audioBytes = memoryStream.ToArray();
            }

            var wavBytes = ConvertWebmToWav(audioBytes);

            using (var ms = new MemoryStream(wavBytes))
            using (var waveReader = new WaveFileReader(ms))
            {
                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = waveReader.Read(buffer, 0, buffer.Length)) > 0)
                {
                    _recognizer.AcceptWaveform(buffer, bytesRead);
                }
                result = _recognizer.FinalResult();
            }

            dynamic? jsonResult = Newtonsoft.Json.JsonConvert.DeserializeObject(result);
            string textResult = jsonResult?.text ?? "";

            return textResult;
        }
        private byte[] ConvertWebmToWav(byte[] webmData)
        {
            string tempWebmPath = Path.GetTempFileName() + ".webm";
            string tempWavPath = Path.GetTempFileName() + ".wav";

            try
            {
                File.WriteAllBytes(tempWebmPath, webmData);

                var process = new System.Diagnostics.Process
                {
                    StartInfo = new System.Diagnostics.ProcessStartInfo
                    {
                        FileName = "ffmpeg",
                        Arguments = $"-i \"{tempWebmPath}\" -acodec pcm_s16le -ar 16000 -ac 1 \"{tempWavPath}\"",
                        RedirectStandardOutput = true,
                        RedirectStandardError = true,
                        UseShellExecute = false,
                        CreateNoWindow = true,
                    }
                };

                process.Start();
                process.WaitForExit();

                if (process.ExitCode != 0)
                {
                    string error = process.StandardError.ReadToEnd();
                    throw new Exception($"FFmpeg error: {error}");
                }

                return File.ReadAllBytes(tempWavPath);
            }
            finally
            {
                if (File.Exists(tempWebmPath)) File.Delete(tempWebmPath);
                if (File.Exists(tempWavPath)) File.Delete(tempWavPath);
            }
        }
    }
}
