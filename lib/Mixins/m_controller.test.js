"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const m_controller_1 = require("./m_controller");
const events_1 = require("events");
const controller_1 = require("../Controller/controller");
const mixer_1 = require("@utkusarioglu/mixer");
const namespace_1 = require("@utkusarioglu/namespace");
controller_1.Controller.set_EventEmitter(events_1.EventEmitter);
test("App get event emitter", () => {
    const ee = controller_1.Controller.get_EventEmitter();
    expect(ee).toBe(events_1.EventEmitter);
});
test("App get EE inside class", () => {
    const app_class_expression = class extends mixer_1.Parent().with(namespace_1.M_Namespace, m_controller_1.M_Controller) {
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
    expect(ee).toBe(events_1.EventEmitter);
});
test("get_Set_Controller", () => {
    const sample_namespace = "sample/namespace";
    const sample_class = class extends mixer_1.Parent().with(m_controller_1.M_Controller) {
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