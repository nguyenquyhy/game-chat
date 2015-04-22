using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace GameChat.Web.TShock
{
    public class TShockRestAPI
    {
        private string hostname;

        public TShockRestAPI(string hostname)
        {
            this.hostname = hostname;
        }

        public async Task<string> InitializeAsync(string username, string password)
        {
            using (var client = new HttpClient())
            {
                var response = await client.GetAsync(string.Format("http://{0}/v2/token/create/{2}?username={1}", hostname, username, password));
                var responseString = await response.Content.ReadAsStringAsync();
                var data = JsonConvert.DeserializeObject<TShockTokenResult>(responseString);
                return data.Token;
            }
        }

        public async Task<string> BroadcastAsync(string token, string msg)
        {
            using (var client = new HttpClient())
            {
                var response = await client.GetAsync(string.Format("http://{0}/v2/server/broadcast?token={1}&msg={2}", hostname, token, msg));
                var responseString = await response.Content.ReadAsStringAsync();
                return responseString;
            }
        }
    }
}
