using Newtonsoft.Json;
using System;

namespace GameChat.Web.TShock
{
    public class TShockTokenResult
    {
        [JsonProperty("status")]
        public string Status { get; set; }
        [JsonProperty("response")]
        public string Response { get; set; }
        [JsonProperty("token")]
        public string Token { get; set; }
        [JsonProperty("deprecated")]
        public string Deprecated { get; set; }
    }
}