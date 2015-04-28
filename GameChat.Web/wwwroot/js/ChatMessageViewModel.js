define(["require", "exports"], function (require, exports) {
    var ChatMessageViewModel = (function () {
        function ChatMessageViewModel(model) {
            var _this = this;
            this.sender = ko.observable(model.sender);
            this.type = ko.observable(model.type);
            this.message = ko.observable(model.message);
            this.timestamp = ko.observable(new Date(Date.parse(model.timestamp)));
            this.origin = ko.observable(model.origin);
            this.friendlyTimestamp = ko.computed(function () {
                var diff = Math.floor((new Date().getTime() - _this.timestamp().getTime()) / 1000);
                if (diff < 60)
                    return "just now";
                else if (diff < 120)
                    return "a minute ago";
                else if (diff < 3600)
                    return Math.floor(diff / 60) + " minute ago";
                else if (diff < 7200)
                    return "an hour ago";
                else if (diff < 86400)
                    return Math.floor(diff / 3600) + " hours ago";
                else if (diff < 172800)
                    return;
            });
        }
        return ChatMessageViewModel;
    })();
    exports.ChatMessageViewModel = ChatMessageViewModel;
});
