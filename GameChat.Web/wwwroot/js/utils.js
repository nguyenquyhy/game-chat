define(["require", "exports"], function (require, exports) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.prototype.guid = function () {
            return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
        };
        Utils.prototype.s4 = function () {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        };
        return Utils;
    })();
    exports.Utils = Utils;
});
//# sourceMappingURL=utils.js.map