"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const m_controller_events_1 = require("./m_controller_events");
const mixer_1 = require("@utkusarioglu/mixer");
const c_controller_1 = require("../Common/c_controller");
const controller_1 = require("../Controller/controller");
const m_controller_1 = require("./m_controller");
const event_emitter_1 = require("@utkusarioglu/event-emitter");
controller_1.Controller.set_EventEmitter(event_emitter_1.EventEmitter);
test("App.initialize_Controller", () => {
    const app_class_expression = class extends mixer_1.Parent().with(m_controller_1.M_Controller, m_controller_events_1.M_ControllerEvents) {
        constructor() {
            super();
            this.set_ControllerEvents();
        }
        get_GlobalNamespace() {
            return c_controller_1.C_Controller.AllServices;
        }
        has_LocalNamespace() {
            return false;
        }
        set_ControllerEvents() {
            this
                .initialize_Controller();
        }
    };
    const controller = new controller_1.Controller("Observer");
    const subscription = new Promise((resolve) => {
        controller.subscribe(c_controller_1.C_BootState.ClassReady, (transmission) => {
            resolve(transmission.Talk);
        }, c_controller_1.C_Controller.AllServices);
    });
    const app_instance = new app_class_expression();
    return expect(subscription).resolves.toBe(c_controller_1.C_BootState.ClassReady);
});
//# sourceMappingURL=m_controller_events.test.js.map