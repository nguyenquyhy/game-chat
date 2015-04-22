define(["require", "exports", 'ChatMessageViewModel'], function (require, exports, chatVM) {
    var AppViewModel = (function () {
        function AppViewModel() {
            var _this = this;
            this.applicationPassword = ko.observable(null);
            this.sources = ko.observableArray([]);
            this.selectedSource = ko.pureComputed({
                read: function () {
                    return _this.source;
                },
                write: function (value) {
                    if (_this.source !== value) {
                        _this.source = value;
                        _this.sourceSelected();
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
            this.canBeSent = ko.computed(function () {
                return _this.newMessage() !== null && _this.newMessage().trim() !== "";
            });
        }
        AppViewModel.prototype.start = function () {
            this.isReady(false);
            this.isLoading(true);
            this.chatMessages.removeAll();
            this.getSource();
        };
        AppViewModel.prototype.getSource = function () {
            var _this = this;
            $.ajax('api/Sources', {
                method: 'GET',
                dataType: 'JSON',
                success: function (data, status, xhr) {
                    _this.sources.removeAll();
                    $.each(data, function (index, item) { return _this.sources.push(item); });
                    _this.isReady(true);
                    _this.isLoading(false);
                },
                error: function (xhr, status, errorString) {
                    alert('Cannot get source! ' + errorString);
                    _this.isLoading(false);
                },
                headers: {
                    "Authorization": "Basic " + this.applicationPassword()
                }
            });
        };
        AppViewModel.prototype.sourceSelected = function () {
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
        };
        AppViewModel.prototype.login = function () {
            var _this = this;
            $.ajax('api/Sources/Login/' + this.source.key, {
                method: 'POST',
                data: {
                    username: this.username(),
                    password: this.password()
                },
                success: function (data, status, xhr) {
                    _this.source.username = _this.username();
                    _this.source.token = data;
                    _this.getChatMessages(_this.source.key);
                    _this.needGameCredential(false);
                },
                error: function (xhr, status, errorString) {
                    alert('Cannot Login! ' + errorString);
                },
                headers: {
                    "Authorization": "Basic " + this.applicationPassword()
                },
            });
        };
        AppViewModel.prototype.send = function () {
            var newChat = {
                timestamp: new Date(),
                sender: this.source.username,
                message: this.newMessage(),
                origin: 'web'
            };
            this.postChatMessage(this.source.key, newChat);
        };
        AppViewModel.prototype.getChatMessages = function (sourceKey) {
            var _this = this;
            this.isChatLoading(true);
            this.isChatReady(false);
            $.ajax('api/Chat/' + sourceKey, {
                method: 'GET',
                dataType: 'JSON',
                success: function (data, status, xhr) {
                    _this.chatMessages.removeAll();
                    $.each(data, function (index, item) { return _this.chatMessages.push(new chatVM.ChatMessageViewModel(item)); });
                    _this.scrollToBottom();
                    _this.isChatReady(true);
                    _this.isChatLoading(false);
                },
                error: function (xhr, status, errorString) {
                    alert('Cannot get chat message! ' + errorString);
                    _this.isChatLoading(false);
                },
                headers: {
                    "Authorization": "Basic " + this.applicationPassword()
                }
            });
        };
        AppViewModel.prototype.postChatMessage = function (sourceKey, message) {
            var _this = this;
            this.isChatSending(true);
            $.ajax('api/Chat/' + sourceKey, {
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(message),
                success: function (data, status, xhr) {
                    _this.newMessage(null);
                    _this.isChatSending(false);
                    $('#txtChat').focus();
                },
                error: function (xhr, status, errorString) {
                    alert('Cannot send message! ' + errorString);
                    _this.isChatSending(false);
                },
                headers: {
                    "Authorization": "Basic " + this.applicationPassword(),
                    "X-TOKEN": this.source.token
                },
            });
        };
        AppViewModel.prototype.addChatMessage = function (sourceKey, message) {
            if (this.isChatReady() && this.source != null && this.source.key === sourceKey) {
                this.chatMessages.push(new chatVM.ChatMessageViewModel(message));
                this.scrollToBottom();
            }
        };
        AppViewModel.prototype.scrollToBottom = function () {
            var chatList = $('#lstChat');
            var scrollHeight = chatList.prop('scrollHeight');
            chatList.animate({ scrollTop: scrollHeight }, "fast");
        };
        return AppViewModel;
    })();
    exports.AppViewModel = AppViewModel;
});
//# sourceMappingURL=AppViewModel.js.map