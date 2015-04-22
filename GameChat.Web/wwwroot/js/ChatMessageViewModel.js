define(["require", "exports"], function (require, exports) {
    var ChatMessageViewModel = (function () {
        function ChatMessageViewModel(model) {
            this.sender = ko.observable(model.sender);
            this.message = ko.observable(model.message);
            this.timestamp = ko.observable(model.timestamp);
        }
        return ChatMessageViewModel;
    })();
    exports.ChatMessageViewModel = ChatMessageViewModel;
});
//# sourceMappingURL=ChatMessageViewModel.js.map