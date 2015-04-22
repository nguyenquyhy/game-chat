using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.Mvc;
using GameChat.Web.Logics;
using System.Threading.Tasks;
using GameChat.Web.Models;
using Microsoft.AspNet.SignalR.Infrastructure;
using GameChat.Web.Hubs;
using Microsoft.AspNet.SignalR;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace GameChat.Web.Controllers.Controllers
{
    [Route("api/[controller]")]
    public class ChatController : Controller
    {
        private IStorageLogic storageLogic;
        private IHubContext chatHub;

        public ChatController(IStorageLogic storageLogic, IConnectionManager connectionManager)
        {
            this.storageLogic = storageLogic;
            this.chatHub = connectionManager.GetHubContext<ChatHub>();
        }

        // GET: api/values
        [HttpGet("{source}")]
        public Task<IEnumerable<ChatMessageModel>> Get(string source)
        {
            return storageLogic.GetMessageAsync(source);
        }
        
        // POST api/values
        [HttpPost("{source}")]
        public async Task Post(string source, [FromBody]ChatMessageModel message)
        {
            await storageLogic.AddMessageAsync(source, message);
            chatHub.Clients.All.addMessage(source, message);
        }
    }
}
