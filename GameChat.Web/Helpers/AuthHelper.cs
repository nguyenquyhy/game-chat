using System;
using System.Text;

namespace GameChat.Web
{
    public class AuthHelper
    {
        public static Tuple<string, string> ParseBasic(string header)
        {
            var auth = System.Net.Http.Headers.AuthenticationHeaderValue.Parse(header);
            if ("Basic".Equals(auth.Scheme, StringComparison.OrdinalIgnoreCase))
            {
                var buffer = Convert.FromBase64String(auth.Parameter);
                var dataString = Encoding.UTF8.GetString(buffer, 0, buffer.Length);
                var tokens = dataString.Split(':');
                return new Tuple<string, string>(tokens[0], tokens[1]);
            }
            else
            {
                throw new InvalidOperationException("Not Basic scheme");
            }
        }
    }
}