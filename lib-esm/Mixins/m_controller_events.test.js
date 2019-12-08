import { M_ControllerEvents } from "./m_controller_events";
import { Parent } from "@utkusarioglu/mixer";
import { C_BootState, C_Controller } from "../Common/c_controller";
import { Controller } from "../Controller/controller";
import { M_Controller } from "./m_controller";
import { EventEmitter } from "@utkusarioglu/event-emitter";
Controller.set_EventEmitter(EventEmitter);
test("App.initialize_Controller", () => {
    const app_class_expression = class extends Parent().with(M_Controller, M_ControllerEvents) {
        constructor() {
            super();
            this.set_ControllerEvents();
        }
        get_GlobalNamespace() {
            return C_Controller.AllServices;
        }
        has_LocalNamespace() {
            return false;
        }
        set_ControllerEvents() {
            this
                .initialize_Controller();
        }
    };
    const controller = new Controller("Observer");
    const subscription = new Promise((resolve) => {
        controller.subscribe(C_BootState.ClassReady, (transmission) => {
            resolve(transmission.Talk);
        }, C_Controller.AllServices);
    });
    const app_instance = new app_class_expression();
    return expect(subscription).resolves.toBe(C_BootState.ClassReady);
});
//# sourceMappingURL=m_controller_events.test.js.map