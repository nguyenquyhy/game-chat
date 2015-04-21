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
                var sourceKey = this.source.key;
                this.isChatLoading(true);
                this.isChatReady(true);
            }
            else {
                this.isChatReady(false);
            }
        };
        return AppViewModel;
    })();
    exports.AppViewModel = AppViewModel;
});
//# sourceMappingURL=AppViewModel.js.map