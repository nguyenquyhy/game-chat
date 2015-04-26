using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GameChat.Web.Models;
using Microsoft.Framework.ConfigurationModel;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using System.Diagnostics;

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

        public Task AddMessageAsync(string sourceKey, ChatMessageModel message)
        {
            throw new NotImplementedException();            
        }

        public Task<IEnumerable<ChatMessageModel>> GetMessageAsync(string sourceKey, DateTime? fromTime = default(DateTime?))
        {
            throw new NotImplementedException();
        }
    }
}