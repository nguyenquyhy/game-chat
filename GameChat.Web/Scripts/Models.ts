interface ISourceModel {
    key: string;
    name: string;
    type: string;
    token: string;
}

interface IChatMessage {
    timestamp: Date;
    sender: string;
    message: string;
}