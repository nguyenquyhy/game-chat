interface ISourceModel {
    key: string;
    name: string;
}

interface IChatMessage {
    isMine: boolean;
    timestamp: Date;
    sender: string;
    message: string;
}