"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SeparatorHandler {
    constructor() {
        this.set_Separators_FromGlobal();
    }
    set_Separators_FromGlobal() {
        if (global.hasOwnProperty("Separator")) {
            this.set_Separators(global.Separator);
        }
        else {
            this.set_Separators({
                Directory: "/",
                Expression: ".",
                Id: "-",
                Dialogue: "?",
                Monologue: ":",
                Namespace: "/",
                Extension: ".",
            });
        }
    }
    set_Separators(separators) {
        SeparatorHandler._SEPARATOR = separators;
    }
    get_Separator(separator_name) {
        return SeparatorHandler._SEPARATOR[separator_name];
    }
}
exports.SeparatorHandler = SeparatorHandler;
//# sourceMappingURL=separator_handler.js.map