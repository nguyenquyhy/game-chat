using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.Mvc;
using GameChat.Web.Models;
using Microsoft.Framework.ConfigurationModel;
using GameChat.Web.TShock;
using System.Threading.Tasks;
using GameChat.Web.Attributes;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace GameChat.Web.Controllers.Controllers
{
    [SimpleAuthorize(isUserBased: false)]
    [Route("api/[controller]")]
    public class SourcesController : Controller
    {
        private IConfiguration configuration;

        public SourcesController(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        // GET: api/sources
        [HttpGet]
        public async Task<IEnumerable<SourceModel>> Get()
        {
            var serverKeys = configuration.GetSubKeys("Chat:Servers");
            var result = new List<SourceModel>();
            foreach (var serverKey in serverKeys)
            {
                var source = await GetSourceInfoAsync(serverKey.Key, null, null);
                result.Add(source);
            }
            return result;
        }

        [HttpGet("{source}")]
        public async Task<SourceModel> Get(string source, string username, string password)
        {
            var sourceModel = await GetSourceInfoAsync(source, username, password);
            return sourceModel;
        }

        private async Task<SourceModel> GetSourceInfoAsync(string sourceKey, string username, string password)
        {
            var name = configuration.Get("Chat:Servers:" + sourceKey + ":Name");
            var type = configuration.Get("Chat:Servers:" + sourceKey + ":Type");
            if (username == null)
                username = configuration.Get("Chat:Servers:" + sourceKey + ":Username");
            if (password == null)
                password = configuration.Get("Chat:Servers:" + sourceKey + ":Password");
            string token = null;
            if (!string.IsNullOrWhiteSpace(username) && !string.IsNullOrWhiteSpace(password))
            {
                try
                {
                    var api = new TShockRestAPI(configuration.Get("Chat:Servers:" + sourceKey + ":Host"));
                    token = await api.InitializeAsync(username, password);
                }
                catch { }
            }
            var source = new SourceModel
            {
                Key = sourceKey,
                Name = name,
                Type = type,
                Token = token,
                Username = string.IsNullOrWhiteSpace(token) ? null : username
            };
            return source;
        }
    }
}
