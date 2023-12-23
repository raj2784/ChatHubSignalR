using Microsoft.AspNetCore.SignalR;

namespace ChatHubSignalR.Hubs
{
    public class ChatHub : Hub
    {
        //public async Task SendMessage(string user, string message)
        //{
        //    await Clients.All.SendAsync("ReceiveMessage", user, message);
        //}
        
        static Dictionary<string, string> clientIds = new Dictionary<string, string>();
        public async Task RegisterMe(string user)
        {
            if (!clientIds.Keys.Contains(user))
            {
                clientIds.Add(user, base.Context.ConnectionId);
                await Clients.All.SendAsync("NewUserRegistered", clientIds.Keys.ToList());
            }
        }

        public async Task SendMessage(string fromUser, string toUser, string message)
        {
            List<string> lst = new List<string>() { clientIds[toUser] };
            IReadOnlyList<string> connectionIds = lst.ToList();
            await Clients.Clients(connectionIds).SendAsync("ReceiveMessage", fromUser, message);
        }
    }
}
