using Newtonsoft.Json;
using System;

namespace GameChat.Web.Models
{
    public class ChatMessageModel : IChatMessageModel
    {
        [JsonProperty("timestamp")]
        public DateTimeOffset Timestamp { get; set; }
        [JsonProperty("sender")]
        public string Sender { get; set; }
        [JsonProperty("type")]
        public string Type { get; set; }
        [JsonProperty("message")]
        public string Message { get; set; }
        [JsonProperty("origin")]
        public string Origin { get; set; }
    }
}