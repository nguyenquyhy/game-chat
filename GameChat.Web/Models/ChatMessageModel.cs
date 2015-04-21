using System;

namespace GameChat.Web.Models
{
    public class ChatMessageModel
    {
        public DateTime Timestamp { get; set; }
        public string Sender { get; set; }
        public string Message { get; set; }
    }
}