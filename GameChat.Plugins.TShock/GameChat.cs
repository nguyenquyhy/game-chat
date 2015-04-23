using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Terraria;
using TerrariaApi.Server;
using TShockAPI;

namespace GameChat.Plugins.TShock
{
    [ApiVersion(1, 17)]
    public class GameChat : TerrariaPlugin
    {
        #region TerrariaPlugin Implementation

        public override string Author
        {
            get { return "Nguyen Quy Hy"; }
        }
        public override string Description
        {
            get { return "Submit chat to GameChat website."; }
        }
        public override string Name
        {
            get { return "GameChat"; }
        }
        public override Version Version
        {
            get { return System.Reflection.Assembly.GetExecutingAssembly().GetName().Version; }
        }

        #endregion

        public GameChat(Main game) : base(game)
        {
            Order = Int32.MaxValue;
        }

        private Config Config { get; set; } = new Config();

        public override void Initialize()
        {
            ServerApi.Hooks.GameInitialize.Register(this, OnInitialize);
            //ServerApi.Hooks.ServerChat.Register(this, OnChat);
            TShockAPI.Hooks.PlayerHooks.PlayerChat += PlayerHooks_PlayerChat;
        }

        async void PlayerHooks_PlayerChat(TShockAPI.Hooks.PlayerChatEventArgs e)
        {
            try
            {
                await SendMessageAsync(Config.Channel, e.Player.Name, e.RawText, e.Player.Group?.Prefix, e.Player.Group?.Suffix);
            }
            catch(Exception ex)
            {
                Console.WriteLine("Cannot send to GameChat! " + ex.Message);
            }
        }

        void OnInitialize(EventArgs e)
        {
            string configPath = Path.Combine(TShockAPI.TShock.SavePath, "gamechatconfig.json");
            (Config = Config.Read(configPath)).Write(configPath);
        }

        async void OnChat(ServerChatEventArgs e)
        {
            var player = TShockAPI.TShock.Players[e.Who];
            await SendMessageAsync(Config.Channel, player.Name, e.Text, player.Group.Prefix, player.Group.Suffix);
        }

        private async Task SendMessageAsync(string channel, string name, string text, string prefix, string suffix)
        {
            var client = new HttpClient();
            var data = new
            {
                sender = name,
                message = text,
                timestamp = DateTime.Now,
                origin = "game"
            };
            var dataString = JsonConvert.SerializeObject(data);
            var content = new StringContent(dataString, Encoding.UTF8, "application/json");
            var base64 = Convert.ToBase64String(Encoding.UTF8.GetBytes(Config.Password + ":"));
            client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", base64);
            await client.PostAsync(channel, content);
        }
    }
}
