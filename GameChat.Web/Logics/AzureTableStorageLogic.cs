using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using GameChat.Web.Models;
using Microsoft.Framework.ConfigurationModel;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using System.Diagnostics;
using GameChat.Web.Logics.Entities;

namespace GameChat.Web.Logics
{
    public class AzureTableStorageLogic : IStorageLogic
    {
        private const string DefaultTableName = "ChatMessages";

        private IConfiguration configuration;
        private CloudTable table;

        public AzureTableStorageLogic(IConfiguration configuration)
        {
            this.configuration = configuration;
            var account = CloudStorageAccount.Parse(configuration.Get("Data:AzureStorage:ConnectionString"));
            var tableClient = account.CreateCloudTableClient();
            table = tableClient.GetTableReference(DefaultTableName);
            if (table.CreateIfNotExists())
            {
                Trace.TraceInformation($"Table {table.Name} is created!");
            }
        }

        public async Task AddMessageAsync(string sourceKey, ChatMessageModel message)
        {
            var operation = TableOperation.Insert(new ChatMessageEntity
                (sourceKey, string.Format("{0:D19}", DateTimeOffset.MaxValue.Ticks - message.Timestamp.Ticks), message));
            var result = await table.ExecuteAsync(operation);
        }

        public async Task<IEnumerable<ChatMessageModel>> GetMessageAsync(string sourceKey, int? countLimit = 100)
        {
            var result = new List<ChatMessageModel>();
                TableContinuationToken token = null;
            do
            {
                var segmentResult = await table.ExecuteQuerySegmentedAsync(new TableQuery<ChatMessageEntity>(), token);
                result.AddRange(segmentResult.Results.Select(r => r.ToModel()));
                token = segmentResult.ContinuationToken;
            }
            while (token != null && (!countLimit.HasValue || result.Count < countLimit.Value));
            return result;
        }
    }
}