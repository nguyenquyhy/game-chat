interface SignalR {
    chatHub: IChatHub;
}

interface IChatHub extends HubConnection {
    client: IChatHubClient;
    server: IChatHubServer;
}

interface IChatHubClient {
    echo(message: string);
    addMessage(sourceKey: string, message: IChatMessage);
}

interface IChatHubServer {
    echo(message: string);
}