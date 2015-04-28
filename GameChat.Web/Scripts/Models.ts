interface ISourceModel {
    key: string;
    name: string;
    type: string;
    username: string;
    token: string;
}

interface IChatMessage {
    timestamp: string;
    sender: string;
    type: string;
    message: string;
    origin: string;
}