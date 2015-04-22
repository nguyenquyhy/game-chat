define(["require", "exports", "AppViewModel"], function (require, exports, appVM) {
    var viewModel = new appVM.AppViewModel();
    ko.applyBindings(viewModel);
    $.connection.logging = true;
    var chatHub = $.connection.chatHub;
    chatHub.client.echo = function (message) {
        alert(message);
    };
    chatHub.client.addMessage = function (sourceKey, message) {
        viewModel.addChatMessage(sourceKey, message);
    };
    $.connection.hub.start().done(function () {
        //chatHub.server.echo('Test');
    });
});
//# sourceMappingURL=app.js.map