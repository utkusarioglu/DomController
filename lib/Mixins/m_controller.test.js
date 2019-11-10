"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const m_controller_1 = require("./m_controller");
test("get_Set_Controller", () => {
    const sample_namespace = "sample/namespace";
    const sample_class = class extends m_controller_1.M_Controller {
        constructor() {
            super();
            this.set_Controller();
        }
        get_GlobalNamespace() {
            return sample_namespace;
        }
        has_LocalNamespace() {
            return false;
        }
        get_ControllerNamespace() {
            return this.get_Controller().get_GlobalNamespace();
        }
    };
    const response = (new sample_class()).get_ControllerNamespace();
    expect(response).toStrictEqual(sample_namespace);
});
//# sourceMappingURL=m_controller.test.js.map