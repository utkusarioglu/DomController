import { M_Controller } from "./m_controller";
import { EventEmitter } from "events";
import { Controller } from "../Controller/controller";
import { Parent } from "@utkusarioglu/mixer";
import { M_Namespace } from "@utkusarioglu/namespace";
Controller.set_EventEmitter(EventEmitter);
test("App get event emitter", () => {
    const ee = Controller.get_EventEmitter();
    expect(ee).toBe(EventEmitter);
});
test("App get EE inside class", () => {
    const app_class_expression = class extends Parent().with(M_Namespace, M_Controller) {
        constructor() {
            super();
            this.set_GlobalNamespace("Test/class");
            this.set_Controller();
        }
        get_EventEmitter() {
            return this.get_Controller().get_EventEmitter();
        }
    };
    const ee = new app_class_expression().get_EventEmitter();
    expect(ee).toBe(EventEmitter);
});
test("get_Set_Controller", () => {
    const sample_namespace = "sample/namespace";
    const sample_class = class extends Parent().with(M_Controller) {
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