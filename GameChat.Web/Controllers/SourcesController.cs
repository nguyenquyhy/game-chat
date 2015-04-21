using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.Mvc;
using GameChat.Web.Models;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace GameChat.Web.Controllers.Controllers
{
    [Route("api/[controller]")]
    public class SourcesController : Controller
    {
        // GET: api/values
        [HttpGet]
        public IEnumerable<SourceModel> Get()
        {
            return new SourceModel[] { new SourceModel { Key = "test1", Name = "Test1" }, new SourceModel { Key = "test2", Name = "Test2" } };
        }

        // GET api/values/5
        [HttpGet("{key}")]
        public string Get(string key)
        {
            return "value";
        }
    }
}
