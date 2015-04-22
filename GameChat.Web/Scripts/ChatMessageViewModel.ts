export class ChatMessageViewModel {
    sender: KnockoutObservable<string>;
    message: KnockoutObservable<string>;
    timestamp: KnockoutObservable<Date>;

    constructor(model: IChatMessage) {
        this.sender = ko.observable(model.sender);
        this.message = ko.observable(model.message);
        this.timestamp = ko.observable(model.timestamp);
    }
}