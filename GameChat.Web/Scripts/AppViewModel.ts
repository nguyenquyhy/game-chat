import utils = require('utils');
import chatVM = require('ChatMessageViewModel');

export class AppViewModel {
    password: KnockoutObservable<string>;
    myId: string;

    sources: KnockoutObservableArray<ISourceModel>;
    selectedSource: KnockoutComputed<ISourceModel>;

    isReady: KnockoutObservable<boolean>;
    isLoading: KnockoutObservable<boolean>;

    source: ISourceModel;

    isChatLoading: KnockoutObservable<boolean>;
    isChatReady: KnockoutObservable<boolean>;
    chatMessages: KnockoutObservableArray<chatVM.ChatMessageViewModel>;

    isChatSending: KnockoutObservable<boolean>;
    canBeSent: KnockoutComputed<boolean>;
    newMessage: KnockoutObservable<string>;

    utils: utils.Utils;

    constructor() {
        this.utils = new utils.Utils();
        this.password = ko.observable(null);
        this.sources = ko.observableArray([]);
        this.selectedSource = ko.pureComputed({
            read: () => {
                return this.source;
            },
            write: (value: ISourceModel) => {
                if (this.source !== value) {
                    this.source = value;
                    this.sourceSelected();
                }
            },
            owner: this
        });

        this.isReady = ko.observable(false);
        this.isLoading = ko.observable(false);

        this.isChatLoading = ko.observable(false);
        this.isChatReady = ko.observable(false);
        this.chatMessages = ko.observableArray([]);

        this.isChatSending = ko.observable(false);
        this.newMessage = ko.observable(null);
        this.canBeSent = ko.computed(() => {
            return this.newMessage() !== null && this.newMessage().trim() !== "";
        });
    }

    start() {
        this.isReady(false);
        this.isLoading(true);
        this.chatMessages.removeAll();
        this.getSource();
    }

    getSource() {
        $.ajax('api/Sources', {
            method: 'GET',
            dataType: 'JSON',
            success: (data: ISourceModel[], status, xhr) => {
                this.sources.removeAll();
                $.each(data,(index, item) => this.sources.push(item));
                this.myId = this.utils.guid();
                this.isReady(true);
                this.isLoading(false);
            },
            error: (xhr, status, errorString) => {
                alert('Cannot get source! ' + errorString);
                this.isLoading(false);
            },
            headers: {
                "Authorization": this.password()
            }
        });
    }

    sourceSelected() {
        if (this.source !== null) {
            this.getChatMessages(this.source.key);
        }
        else {
            this.isChatReady(false);
        }
    }

    send() {
        var newChat: IChatMessage = {
            timestamp: new Date(),
            sender: this.myId,
            message: this.newMessage()
        };
        this.postChatMessage(this.source.key, newChat);
    }

    getChatMessages(sourceKey: string) {
        this.isChatLoading(true);
        this.isChatReady(false);
        $.ajax('api/Chat/' + sourceKey, {
            method: 'GET',
            dataType: 'JSON',
            success: (data: IChatMessage[], status, xhr) => {
                this.chatMessages.removeAll();
                $.each(data,(index, item) => this.chatMessages.push(new chatVM.ChatMessageViewModel(item)));
                this.isChatReady(true);
                this.isChatLoading(false);
            },
            error: (xhr, status, errorString) => {
                alert('Cannot get chat message! ' + errorString);
                this.isChatLoading(false);
            },
            headers: {
                "Authorization": this.password()
            }
        });
    }

    postChatMessage(sourceKey: string, message: IChatMessage) {
        this.isChatSending(true);
        $.ajax('api/Chat/' + sourceKey, {
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(message),
            success: (data, status, xhr) => {
                this.newMessage(null);
                this.isChatSending(false);
            },
            error: (xhr, status, errorString) => {
                alert('Cannot send message! ' + errorString);
                this.isChatSending(false);
            },
            headers: {
                "Authorization": this.password()
            },
        });
    }

    addChatMessage(sourceKey: string, message: IChatMessage) {
        if (this.isChatReady() && this.source != null && this.source.key === sourceKey) {
            this.chatMessages.push(new chatVM.ChatMessageViewModel(message));
        }
    }
}