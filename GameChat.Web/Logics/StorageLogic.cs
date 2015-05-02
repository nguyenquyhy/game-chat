using GameChat.Web.Models;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GameChat.Web.Logics
{
    public interface IStorageLogic
    {
        Task AddMessageAsync(string sourceKey, ChatMessageModel message);
        Task<IEnumerable<ChatMessageModel>> GetMessageAsync(string sourceKey, int? countLimit = 100);
    }

    public class InMemoryStorageLogic : IStorageLogic
    {
        private static Dictionary<string, List<ChatMessageModel>> cachedMessages = new Dictionary<string, List<ChatMessageModel>>();

        public Task AddMessageAsync(string sourceKey, ChatMessageModel message)
        {
            if (!cachedMessages.ContainsKey(sourceKey))
                cachedMessages.Add(sourceKey, new List<ChatMessageModel>());
            cachedMessages[sourceKey].Add(message);
            return Task.FromResult(true);
        }

        public Task<IEnumerable<ChatMessageModel>> GetMessageAsync(string sourceKey, int? countLimit = 100)
        {
            if (cachedMessages.ContainsKey(sourceKey))
            {
                if (countLimit.HasValue)
                    return Task.FromResult(cachedMessages[sourceKey].OrderByDescending(o => o.Timestamp).Take(countLimit.Value));
                else
                    return Task.FromResult(cachedMessages[sourceKey].AsEnumerable());
            }
            else
                return Task.FromResult(new List<ChatMessageModel>().AsEnumerable());
        }
    }
}