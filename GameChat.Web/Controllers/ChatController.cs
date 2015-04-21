using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.Mvc;
using GameChat.Web.Logics;
using System.Threading.Tasks;
using GameChat.Web.Models;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace GameChat.Web.Controllers.Controllers
{
    [Route("api/[controller]")]
    public class ChatController : Controller
    {
        private IStorageLogic storageLogic;

        public ChatController(IStorageLogic storageLogic)
        {
            this.storageLogic = storageLogic;
        }

        // GET: api/values
        [HttpGet("{source}")]
        public Task<IEnumerable<ChatMessageModel>> Get(string source)
        {
            return storageLogic.GetMessage(source);
        }
        
        // POST api/values
        [HttpPost("{source}")]
        public async Task Post(string source, ChatMessageModel message)
        {
        }
    }
}
