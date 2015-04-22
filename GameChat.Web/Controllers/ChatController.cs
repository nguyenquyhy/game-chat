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

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace GameChat.Web.Controllers.Controllers
{
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
            var password = configuration.Get("Chat:Password");
            if (Request.Headers["Authorization"] != password) return new HttpStatusCodeResult(403);
            return Json(await storageLogic.GetMessageAsync(source));
        }
        
        // POST api/values
        [HttpPost("{source}")]
        public async Task<ActionResult> Post(string source, [FromBody]ChatMessageModel message)
        {
            var password = configuration.Get("Chat:Password");
            if (Request.Headers["Authorization"] != password) return new HttpStatusCodeResult(403);
            await storageLogic.AddMessageAsync(source, message);
            chatHub.Clients.All.addMessage(source, message);
            return new HttpStatusCodeResult(204);
        }
    }
}
