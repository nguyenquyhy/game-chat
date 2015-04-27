import chatVM = require('ChatMessageViewModel');

export class AppViewModel {
    hasLocalStorage: KnockoutObservable<boolean>;

    applicationPassword: KnockoutObservable<string>;

    sources: KnockoutObservableArray<ISourceModel>;
    selectedSource: KnockoutComputed<ISourceModel>;

    isReady: KnockoutObservable<boolean>;
    isLoading: KnockoutObservable<boolean>;

    source: ISourceModel;

    needGameCredential: KnockoutObservable<boolean>;
    username: KnockoutObservable<string>;
    password: KnockoutObservable<string>;
    remember: KnockoutObservable<boolean>;
    isLoggingIn: KnockoutObservable<boolean>;

    isChatLoading: KnockoutObservable<boolean>;
    isChatReady: KnockoutObservable<boolean>;
    chatMessages: KnockoutObservableArray<chatVM.ChatMessageViewModel>;
    unreadCount: KnockoutObservable<number>;

    isChatSending: KnockoutObservable<boolean>;
    canBeSent: KnockoutComputed<boolean>;
    newMessage: KnockoutObservable<string>;

    isBlur: KnockoutObservable<boolean>;

    constructor() {
        this.hasLocalStorage = ko.observable(typeof (Storage) !== "undefined");

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
        this.remember = ko.observable(false);
        this.isLoggingIn = ko.observable(false);

        this.isChatLoading = ko.observable(false);
        this.isChatReady = ko.observable(false);
        this.chatMessages = ko.observableArray([]);
        this.unreadCount = ko.observable(0);

        this.isChatSending = ko.observable(false);
        this.newMessage = ko.observable(null);
        this.canBeSent = ko.computed(() => {
            return this.newMessage() !== null && this.newMessage().trim() !== "";
        });

        this.isBlur = ko.observable(false);
        window.onblur = () => {
            this.isBlur(true);
        };
        window.onfocus = () => {
            this.isBlur(false);
            this.unreadCount(0);
            document.title = 'GameChat';
        }
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
            cache: false,
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
                "Authorization": this.getAuthHeader()
            }
        });
    }

    sourceSelected() {
        if (this.source !== null) {
            if (this.source.token == null && typeof (Storage) !== "undefined" && localStorage.getItem(this.source.key + ":token") != null) {
                this.source.token = localStorage.getItem(this.source.key + ":token");
                this.source.username = localStorage.getItem(this.source.key + ":username");
            }

            if (this.source.token == null) {
                this.username(null);
                this.password(null);
                this.remember(false);
                this.isChatLoading(false);
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
        this.isLoggingIn(true);
        $.ajax('api/Sources/' + this.source.key, {
            method: 'GET',
            data: {
                username: this.username(), password: this.password()
            },
            cache: false,
            success: (data: ISourceModel, status, xhr) => {
                if (this.source.key === data.key) {
                    this.isLoggingIn(false);
                    if (data.token != null) {
                        this.source.username = data.username;
                        this.source.token = data.token;
                        this.getChatMessages(this.source.key);
                        this.needGameCredential(false);

                        if (this.remember() && typeof (Storage) !== "undefined") {
                            localStorage.setItem(data.key + ":username", data.username);
                            localStorage.setItem(data.key + ":token", data.token);
                        }
                    } else {
                        alert('Cannot Login! Please check your username and password.');
                    }
                }
            },
            error: (xhr, status, errorString) => {
                this.isLoggingIn(false);
                alert('Cannot Login! ' + errorString);
            },
            headers: {
                "Authorization": this.getAuthHeader()
            },
        });
    }

    send() {
        var newChat: IChatMessage = {
            timestamp: new Date(),
            sender: this.source.username,
            type: 'Chat',
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
            cache: false,
            success: (data: IChatMessage[], status, xhr) => {
                this.chatMessages.removeAll();
                $.each(data,(index, item) => this.chatMessages.push(new chatVM.ChatMessageViewModel(item)));
                this.isChatReady(true);
                this.isChatLoading(false);
                this.scrollToBottom();
            },
            error: (xhr, status, errorString) => {
                alert('Cannot get chat message! ' + errorString);
                this.isChatLoading(false);
            },
            headers: {
                "Authorization": this.getAuthHeader()
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
                $('#txtChat').focus();
            },
            error: (xhr, status, errorString) => {
                alert('Cannot send message! ' + errorString);
                this.isChatSending(false);
            },
            headers: {
                "Authorization": this.getAuthHeader()
            }
        });
    }

    addChatMessage(sourceKey: string, message: IChatMessage) {
        if (this.isChatReady() && this.source != null && this.source.key === sourceKey) {
            this.chatMessages.push(new chatVM.ChatMessageViewModel(message));
            this.scrollToBottom();
        }
    }

    scrollToBottom() {
        var chatList = $('#lstChat');
        var scrollHeight = chatList.prop('scrollHeight');
        chatList.animate({ scrollTop: scrollHeight }, "fast");
    }

    getAuthHeader() {
        var token = "";
        if (this.source != null && this.source.token != null) token = this.source.token;
        return "Basic " + window.btoa(this.applicationPassword() + ':' + token);
    }
}