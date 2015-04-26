using Microsoft.WindowsAzure.Storage.Table;
using System;
using Microsoft.WindowsAzure.Storage;
using System.Collections.Generic;
using GameChat.Web.Models;

namespace GameChat.Web.Logics.Entities
{
    public class ChatMessageEntity : TableEntity, IChatMessageModel
    {
        public ChatMessageEntity(string partitionKey, string rowKey) : base(partitionKey, rowKey)
        {
        }

        public ChatMessageEntity(string partitionKey, string rowKey, ChatMessageModel model) : base(partitionKey, rowKey)
        {
            this.Message = model.Message;
            this.Origin = model.Origin;
            this.Sender = model.Sender;
            this.Type = model.Type;
            this.Timestamp = model.Timestamp;
        }

        public string Message { get; set; }

        public string Origin { get; set; }

        public string Sender { get; set; }

        public string Type { get; set; }
    }
}