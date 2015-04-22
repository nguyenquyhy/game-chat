import chatVM = require('ChatMessageViewModel');

export class AppViewModel {
    applicationPassword: KnockoutObservable<string>;

    sources: KnockoutObservableArray<ISourceModel>;
    selectedSource: KnockoutComputed<ISourceModel>;

    isReady: KnockoutObservable<boolean>;
    isLoading: KnockoutObservable<boolean>;

    source: ISourceModel;

    needGameCredential: KnockoutObservable<boolean>;
    username: KnockoutObservable<string>;
    password: KnockoutObservable<string>;

    isChatLoading: KnockoutObservable<boolean>;
    isChatReady: KnockoutObservable<boolean>;
    chatMessages: KnockoutObservableArray<chatVM.ChatMessageViewModel>;

    isChatSending: KnockoutObservable<boolean>;
    canBeSent: KnockoutComputed<boolean>;
    newMessage: KnockoutObservable<string>;

    constructor() {
        this.applicationPassword = ko.observable(null);
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

        this.needGameCredential = ko.observable(false);
        this.username = ko.observable(null);
        this.password = ko.observable(null);

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
                this.isReady(true);
                this.isLoading(false);
            },
            error: (xhr, status, errorString) => {
                alert('Cannot get source! ' + errorString);
                this.isLoading(false);
            },
            headers: {
                "Authorization": "Basic " + this.applicationPassword()
            }
        });
    }

    sourceSelected() {
        if (this.source !== null) {
            if (this.source.token == null) {
                this.needGameCredential(true);
            }
            else {
                this.needGameCredential(false);
                this.getChatMessages(this.source.key);
            }
        }
        else {
            this.isChatReady(false);
        }
    }

    login() {
        $.ajax('api/Sources/Login/' + this.source.key, {
            method: 'POST',
            data: {
                username: this.username(), password: this.password()
            },
            success: (data: string, status, xhr) => {
                this.source.username = this.username();
                this.source.token = data;
                this.getChatMessages(this.source.key);
                this.needGameCredential(false);
            },
            error: (xhr, status, errorString) => {
                alert('Cannot Login! ' + errorString);
            },
            headers: {
                "Authorization": "Basic " + this.applicationPassword()
            },
        });
    }

    send() {
        var newChat: IChatMessage = {
            timestamp: new Date(),
            sender: this.source.username,
            message: this.newMessage(),
            origin: 'web'
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
                "Authorization": "Basic " + this.applicationPassword()
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
                "Authorization": "Basic " + this.applicationPassword(),
                "X-TOKEN": this.source.token
            },
        });
    }

    addChatMessage(sourceKey: string, message: IChatMessage) {
        if (this.isChatReady() && this.source != null && this.source.key === sourceKey) {
            this.chatMessages.push(new chatVM.ChatMessageViewModel(message));
        }
    }
}