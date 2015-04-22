interface ISourceModel {
    key: string;
    name: string;
}

interface IChatMessage {
    timestamp: Date;
    sender: string;
    message: string;
}