"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("../Controller/controller");
const c_controller_1 = require("../Common/c_controller");
class M_Controller {
    set_Controller() {
        if (this._controller) {
            throw new Error(c_controller_1.C_Controller.E_AlreadyDefined);
        }
        this._controller = new controller_1.Controller(this.get_GlobalNamespace());
        if (this.has_LocalNamespace()) {
            this._controller.set_LocalNamespace(this.get_LocalNamespace());
        }
        return this;
    }
    get_Controller() {
        if (!(this._controller instanceof controller_1.Controller)) {
            throw new Error(c_controller_1.C_Controller.E_CalledBeforeDeclaration);
        }
        return this._controller;
    }
}
exports.M_Controller = M_Controller;
//# sourceMappingURL=m_controller.js.map