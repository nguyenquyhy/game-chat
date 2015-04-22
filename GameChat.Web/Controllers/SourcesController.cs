using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.Mvc;
using GameChat.Web.Models;
using Microsoft.Framework.ConfigurationModel;
using GameChat.Web.TShock;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace GameChat.Web.Controllers.Controllers
{
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
        public async Task<ActionResult> Get()
        {
            var applicationPassword = configuration.Get("Chat:Password");
            if (applicationPassword != null && Request.Headers["Authorization"] != "Basic " + applicationPassword) return new HttpStatusCodeResult(403);
            var serverKeys = configuration.GetSubKeys("Chat:Servers");
            var result = new List<SourceModel>();
            foreach (var serverKey in serverKeys)
            {
                var name = configuration.Get("Chat:Servers:" + serverKey.Key + ":Name");
                var type = configuration.Get("Chat:Servers:" + serverKey.Key + ":Type");
                var username = configuration.Get("Chat:Servers:" + serverKey.Key + ":Username");
                var password = configuration.Get("Chat:Servers:" + serverKey.Key + ":Password");
                string token = null;
                if (!string.IsNullOrWhiteSpace(username) && !string.IsNullOrWhiteSpace(password))
                {
                    token = await Login(serverKey.Key, username, password);
                }
                result.Add(new SourceModel
                {
                    Key = serverKey.Key,
                    Name = name,
                    Type = type,
                    Token = token
                });
            }
            return Json(result);
        }

        [HttpPost("login/{source}")]
        public async Task<string> Login(string source, string username, string password)
        {
            var api = new TShockRestAPI(configuration.Get("Chat:Servers:" + source + ":Host"));
            var token = await api.InitializeAsync(username, password);
            return token;
        }
    }
}
