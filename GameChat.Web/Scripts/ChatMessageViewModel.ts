export class ChatMessageViewModel {
    sender: KnockoutObservable<string>;
    message: KnockoutObservable<string>;
    timestamp: KnockoutObservable<Date>;
    origin: KnockoutObservable<string>;

    constructor(model: IChatMessage) {
        this.sender = ko.observable(model.sender);
        this.message = ko.observable(model.message);
        this.timestamp = ko.observable(model.timestamp);
        this.origin = ko.observable(model.origin);
    }
}