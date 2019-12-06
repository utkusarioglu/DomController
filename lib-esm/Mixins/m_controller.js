import { Controller } from "../Controller/controller";
import { C_Controller } from "../Common/c_controller";
export class M_Controller {
    set_Controller() {
        if (this._controller) {
            throw new Error(C_Controller.E_AlreadyDefined);
        }
        this._controller = new Controller(this.get_GlobalNamespace());
        if (this.has_LocalNamespace()) {
            this._controller.set_LocalNamespace(this.get_LocalNamespace());
        }
        return this;
    }
    get_Controller() {
        if (!(this._controller instanceof Controller)) {
            throw new Error(C_Controller.E_CalledBeforeDeclaration);
        }
        return this._controller;
    }
}
//# sourceMappingURL=m_controller.js.map