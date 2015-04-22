interface ISourceModel {
    key: string;
    name: string;
    type: string;
    username: string;
    token: string;
}

interface IChatMessage {
    timestamp: Date;
    sender: string;
    message: string;
    origin: string;
}