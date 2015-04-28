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
        if (viewModel.isBlur()) {
            viewModel.unreadCount(viewModel.unreadCount() + 1);
            document.title = viewModel.unreadCount() + " new message" + (viewModel.unreadCount() > 1 ? "s" : "") + " - GameChat";
        }
    };
    $.connection.hub.stateChanged(function (change) {
        console.log('State changed: ' + change.oldState + ' -> ' + change.newState);
    });
    $.connection.hub.start().done(function () {
        //chatHub.server.echo('Test');
    });
    $('.body-content').fadeIn(500);
    $('#txtAppPassword').focus();
});
