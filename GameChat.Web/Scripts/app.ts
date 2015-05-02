import appVM = require("AppViewModel");

var viewModel = new appVM.AppViewModel();
ko.applyBindings(viewModel);

$.connection.logging = true;

var chatHub = $.connection.chatHub;

chatHub.client.echo = (message) => {
    alert(message);
};

chatHub.client.addMessage = (sourceKey, message) => {
    viewModel.addChatMessage(sourceKey, message);
    if (viewModel.isBlur()) {
        viewModel.unreadCount(viewModel.unreadCount() + 1);
        document.title = viewModel.unreadCount() + " new message" + (viewModel.unreadCount() > 1 ? "s" : "") + " - GameChat";
    }
}

$.connection.hub.stateChanged(change => {
    console.log('State changed: ' + change.oldState + ' -> ' + change.newState);
});

$.connection.hub.start().done(() => {
    //chatHub.server.echo('Test');
});

$('.body-content').fadeIn(500);
$('#txtAppPassword').focus();
