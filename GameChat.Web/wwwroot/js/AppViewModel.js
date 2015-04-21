define(["require", "exports"], function (require, exports) {
    var AppViewModel = (function () {
        function AppViewModel() {
            var _this = this;
            this.password = ko.observable(null);
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
            this.isChatLoading = ko.observable(false);
            this.isChatReady = ko.observable(false);
            this.chatMessages = ko.observableArray([]);
            this.isChatSending = ko.observable(false);
            this.newMessage = ko.observable(null);
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
                    "Authorization": this.password()
                }
            });
        };
        AppViewModel.prototype.sourceSelected = function () {
            if (this.source !== null) {
                this.getChatMessages(this.source.key);
            }
            else {
                this.isChatReady(false);
            }
        };
        AppViewModel.prototype.send = function () {
            var newChat = {
                timestamp: new Date(),
                sender: 'Test',
                message: this.newMessage(),
                isMine: true
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
                    $.each(data, function (index, item) { return _this.chatMessages.push(item); });
                    _this.isChatReady(true);
                    _this.isChatLoading(false);
                },
                error: function (xhr, status, errorString) {
                    alert('Cannot get chat message! ' + errorString);
                    _this.isChatLoading(false);
                },
                headers: {
                    "Authorization": this.password()
                }
            });
        };
        AppViewModel.prototype.postChatMessage = function (sourceKey, message) {
            var _this = this;
            this.isChatSending(true);
            $.ajax('api/Chat/' + sourceKey, {
                method: 'POST',
                dataType: 'JSON',
                data: message,
                success: function (data, status, xhr) {
                    _this.chatMessages.push(message);
                    _this.isChatSending(false);
                },
                error: function (xhr, status, errorString) {
                    alert('Cannot send message! ' + errorString);
                    _this.isChatSending(false);
                },
                headers: {
                    "Authorization": this.password()
                }
            });
        };
        return AppViewModel;
    })();
    exports.AppViewModel = AppViewModel;
});
//# sourceMappingURL=AppViewModel.js.map