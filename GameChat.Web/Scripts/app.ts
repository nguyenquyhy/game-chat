require(["AppViewModel"], (appVM) => {
    var viewModel = new appVM.AppViewModel();
    ko.applyBindings(viewModel);
});