using Microsoft.AspNet.Mvc;
using Microsoft.Framework.ConfigurationModel;
using System;
using System.Threading.Tasks;

namespace GameChat.Web.Attributes
{
    public class SimpleAuthorizeAttribute : AuthorizeAttribute
    {
        private IConfiguration configuration;

        public SimpleAuthorizeAttribute(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public override Task OnAuthorizationAsync(AuthorizationContext context)
        {
            var applicationPassword = configuration.Get("Chat:Password");
            if (applicationPassword != null) {
                try
                {
                    var header = context.HttpContext.Request.Headers["Authorization"];
                    var data = AuthHelper.ParseBasic(header);
                    if (data.Item1 != applicationPassword)
                        throw new UnauthorizedAccessException();
                }
                catch
                {
                    throw new UnauthorizedAccessException();
                }
            }
            return Task.FromResult(true);
        }
    }
}