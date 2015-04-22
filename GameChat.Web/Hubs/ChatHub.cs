using Microsoft.AspNet.SignalR;
using System;

namespace GameChat.Web.Hubs
{
    public class ChatHub : Hub
    {
        public void Echo(string message)
        {
            Clients.Caller.echo(message);
        }
    }
}