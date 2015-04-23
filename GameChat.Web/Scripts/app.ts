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
}

$.connection.hub.start().done(() => {
    //chatHub.server.echo('Test');
});

$('.body-content').fadeIn(500);
$('#txtAppPassword').focus();