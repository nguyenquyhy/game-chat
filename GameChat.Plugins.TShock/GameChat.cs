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
            TShockAPI.Hooks.PlayerHooks.PlayerChat += PlayerHooks_PlayerChat;
            TShockAPI.Hooks.PlayerHooks.PlayerCommand += PlayerHooks_PlayerCommand;
            ServerApi.Hooks.ServerJoin.Register(this, OnServerJoin);
            ServerApi.Hooks.ServerLeave.Register(this, OnServerLeave);
        }

        private async void OnServerJoin(JoinEventArgs e)
        {
            try
            {
                var player = Main.player[e.Who];
                await SendMessageAsync(Config.Channel, player.name, "Join", null, null, null);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Cannot send to GameChat! " + ex.Message);
            }
        }

        private async void OnServerLeave(LeaveEventArgs e)
        {
            try
            {
                var player = Main.player[e.Who];
                await SendMessageAsync(Config.Channel, player.name, "Leave", null, null, null);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Cannot send to GameChat! " + ex.Message);
            }
        }

        private void PlayerHooks_PlayerCommand(TShockAPI.Hooks.PlayerCommandEventArgs e)
        {
            
        }

        async void PlayerHooks_PlayerChat(TShockAPI.Hooks.PlayerChatEventArgs e)
        {
            try
            {
                await SendMessageAsync(Config.Channel, e.Player.Name, "Chat", e.RawText, e.Player.Group?.Prefix, e.Player.Group?.Suffix);
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

        private async Task SendMessageAsync(string channel, string name, string type, string text, string prefix, string suffix)
        {
            var client = new HttpClient();
            var data = new
            {
                sender = name,
                type = type,
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
