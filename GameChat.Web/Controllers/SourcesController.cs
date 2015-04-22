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
        public ActionResult Get()
        {
            var password = configuration.Get("Chat:Password");
            if (password != null && Request.Headers["Authorization"] != "Basic " + password) return new HttpStatusCodeResult(403);
            var serverKeys = configuration.GetSubKeys("Chat:Servers");
            return Json(serverKeys.Select(o => new SourceModel { Key = o.Key, Name = configuration.Get("Chat:Servers:" + o.Key + ":Name") }));
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
