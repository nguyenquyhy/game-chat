using Microsoft.AspNet.Mvc;
using System;
using System.Threading.Tasks;

namespace GameChat.Web.Attributes
{
    public class SimpleAuthorizeAttribute : AuthorizeAttribute
    {
        private bool isUserBased;

        public SimpleAuthorizeAttribute(bool isUserBased)
        {
            this.isUserBased = isUserBased;
        }

        public override Task OnAuthorizationAsync(AuthorizationContext context)
        {
            //var applicationPassword = configuration.Get("Chat:Password");
            //if (applicationPassword != null && Request.Headers["Authorization"] != "Basic " + applicationPassword) return new HttpStatusCodeResult(403);
            //return base.OnAuthorizationAsync(context);
            return Task.FromResult(true);
        }
    }
}