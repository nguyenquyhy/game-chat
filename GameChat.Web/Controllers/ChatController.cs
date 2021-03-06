﻿using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.Mvc;
using GameChat.Web.Logics;
using System.Threading.Tasks;
using GameChat.Web.Models;
using Microsoft.AspNet.SignalR.Infrastructure;
using GameChat.Web.Hubs;
using Microsoft.AspNet.SignalR;
using Microsoft.Framework.ConfigurationModel;
using GameChat.Web.TShock;
using GameChat.Web.Attributes;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace GameChat.Web.Controllers.Controllers
{
    [ServiceFilter(typeof(SimpleAuthorizeAttribute))]
    [Route("api/[controller]")]
    public class ChatController : Controller
    {
        private IStorageLogic storageLogic;
        private IHubContext chatHub;
        private IConfiguration configuration;

        public ChatController(IConfiguration configuration, IStorageLogic storageLogic, IConnectionManager connectionManager)
        {
            this.configuration = configuration;
            this.storageLogic = storageLogic;
            this.chatHub = connectionManager.GetHubContext<ChatHub>();
        }

        // GET: api/values
        [HttpGet("{source}")]
        public async Task<ActionResult> Get(string source)
        {
            return Json((await storageLogic.GetMessageAsync(source)).OrderBy(o => o.Timestamp));
        }
        
        // POST api/values
        [HttpPost("{source}")]
        public async Task<ActionResult> Post(string source, [FromBody]ChatMessageModel message)
        {
            var data = AuthHelper.ParseBasic(Request.Headers["Authorization"]);
            var token = data.Item2;
            var api = new TShockRestAPI(configuration.Get("Chat:Servers:" + source + ":Host"));
            var result = await api.BroadcastAsync(token, message.Sender, message.Message);

            message.Timestamp = DateTimeOffset.UtcNow;

            await storageLogic.AddMessageAsync(source, message);
            chatHub.Clients.All.addMessage(source, message);
            return new HttpStatusCodeResult(204);
        }
    }
}
