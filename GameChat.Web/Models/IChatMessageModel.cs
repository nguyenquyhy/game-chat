using System;

namespace GameChat.Web.Models
{
    public interface IChatMessageModel
    {
        string Message { get; set; }
        string Origin { get; set; }
        string Sender { get; set; }
        DateTimeOffset Timestamp { get; set; }
        string Type { get; set; }
    }
}