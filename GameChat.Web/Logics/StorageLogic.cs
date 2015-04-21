using GameChat.Web.Models;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GameChat.Web.Logics
{
    public interface IStorageLogic
    {
        Task AddMessage(string sourceKey, ChatMessageModel message);
        Task<IEnumerable<ChatMessageModel>> GetMessage(string sourceKey, DateTime? fromTime = null);
    }

    public class InMemoryStorageLogic : IStorageLogic
    {
        private static Dictionary<string, List<ChatMessageModel>> cachedMessages = new Dictionary<string, List<ChatMessageModel>>();

        public Task AddMessage(string sourceKey, ChatMessageModel message)
        {
            if (cachedMessages.ContainsKey(sourceKey))
                cachedMessages[sourceKey].Add(message);
            else
                cachedMessages.Add(sourceKey, new List<ChatMessageModel>());
            return Task.FromResult(true);
        }

        public Task<IEnumerable<ChatMessageModel>> GetMessage(string sourceKey, DateTime? fromTime = null)
        {
            if (cachedMessages.ContainsKey(sourceKey))
            {
                if (fromTime.HasValue)
                    return Task.FromResult(cachedMessages[sourceKey].Where(o => o.Timestamp > fromTime.Value));
                else
                    return Task.FromResult(cachedMessages[sourceKey].AsEnumerable());
            }
            else
                return Task.FromResult(new List<ChatMessageModel>().AsEnumerable());
        }
    }
}