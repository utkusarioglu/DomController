import { M_ControllerEvents } from "./m_controller_events";
import { Parent } from "@utkusarioglu/mixer";
import { e_Scope } from "../Common/t_controller";
import { C_BootState, C_StartupTalk, C_Controller } from "../Common/c_controller";
import { Controller } from "../Controller/controller";
import { M_Controller } from "./m_controller";
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
        controller.subscribe(e_Scope.Global, C_Controller.AllServices, C_BootState.ClassReady, (transmission) => {
            resolve(transmission.Talk);
        });
    });
    const app_instance = new app_class_expression();
    return expect(subscription).resolves.toBe(C_BootState.ClassReady);
});
test("Child.announce", () => {
    const child_class_exp1 = class extends Parent().with(M_Controller, M_ControllerEvents) {
        constructor() {
            super();
            this.set_ControllerEvents();
        }
        get_GlobalNamespace() {
            return "Child/Class/1";
        }
        has_LocalNamespace() {
            return false;
        }
        set_ControllerEvents() {
            this
                .initialize_Controller();
        }
        announce_ListenReady() {
            this.get_Controller().announce(e_Scope.Global, C_Controller.AllServices, C_BootState.ListenReady, 3000);
        }
    };
    const controller = new Controller("Observer");
    const response = new Promise((resolve) => {
        controller.subscribe(e_Scope.Global, C_Controller.AllServices, C_BootState.ClassReady, (transmission) => {
            resolve(transmission.Talk);
        });
    });
    const child1 = (new child_class_exp1());
    return expect(response).resolves.toBe(C_BootState.ClassReady);
});
test("App_Controller", () => {
    Controller.flush_GlobalController();
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
        manage_BootUp() {
            const sequence_members = this.get_Controller().get_GlobalNamespaces();
            const sequence_steps = [
                {
                    List: sequence_members,
                    Listen: C_BootState.ClassReady,
                },
                {
                    List: ["Child/Class/1"],
                    Talk: C_StartupTalk.run_Listen,
                    Listen: C_BootState.ListenReady,
                },
            ];
            const sequence_manager = this.manage_ControllerSequence(sequence_steps, e_Scope.Global, C_Controller.AllServices);
            return sequence_manager;
        }
    };
    const child_class_exp1 = class extends Parent().with(M_Controller, M_ControllerEvents) {
        constructor() {
            super();
            this.set_ControllerEvents();
        }
        get_GlobalNamespace() {
            return "Child/Class/1";
        }
        has_LocalNamespace() {
            return false;
        }
        set_ControllerEvents() {
            this
                .initialize_Controller();
        }
        announce_ListenReady() {
            this.get_Controller().announce(e_Scope.Global, C_Controller.AllServices, C_BootState.ListenReady, 300);
        }
    };
    const manager = (new app_class_expression());
    const child1 = (new child_class_exp1());
    const sequence = new Promise((resolve) => {
        setTimeout(() => {
            resolve(manager.manage_BootUp());
        }, 100);
    });
    return expect(sequence).resolves.toStrictEqual([
        C_BootState.ClassReady,
        C_BootState.ListenReady
    ]);
});
//# sourceMappingURL=m_controller_events.test.js.map