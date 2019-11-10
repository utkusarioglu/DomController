"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const m_controller_events_1 = require("./m_controller_events");
const mixer_1 = require("@utkusarioglu/mixer");
const t_controller_1 = require("../Common/t_controller");
const c_controller_1 = require("../Common/c_controller");
const controller_1 = require("../Controller/controller");
const m_controller_1 = require("./m_controller");
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
        controller.subscribe(t_controller_1.e_Scope.Global, c_controller_1.C_Controller.AllServices, c_controller_1.C_BootState.ClassReady, (transmission) => {
            resolve(transmission.Talk);
        });
    });
    const app_instance = new app_class_expression();
    return expect(subscription).resolves.toBe(c_controller_1.C_BootState.ClassReady);
});
test("Child.announce", () => {
    const child_class_exp1 = class extends mixer_1.Parent().with(m_controller_1.M_Controller, m_controller_events_1.M_ControllerEvents) {
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
            this.get_Controller().announce(t_controller_1.e_Scope.Global, c_controller_1.C_Controller.AllServices, c_controller_1.C_BootState.ListenReady, 3000);
        }
    };
    const controller = new controller_1.Controller("Observer");
    const response = new Promise((resolve) => {
        controller.subscribe(t_controller_1.e_Scope.Global, c_controller_1.C_Controller.AllServices, c_controller_1.C_BootState.ClassReady, (transmission) => {
            resolve(transmission.Talk);
        });
    });
    const child1 = (new child_class_exp1());
    return expect(response).resolves.toBe(c_controller_1.C_BootState.ClassReady);
});
test("App_Controller", () => {
    controller_1.Controller.flush_GlobalController();
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
        manage_BootUp() {
            const sequence_members = this.get_Controller().get_GlobalNamespaces();
            const sequence_steps = [
                {
                    List: sequence_members,
                    Listen: c_controller_1.C_BootState.ClassReady,
                },
                {
                    List: ["Child/Class/1"],
                    Talk: c_controller_1.C_StartupTalk.run_Listen,
                    Listen: c_controller_1.C_BootState.ListenReady,
                },
            ];
            const sequence_manager = this.manage_ControllerSequence(sequence_steps, t_controller_1.e_Scope.Global, c_controller_1.C_Controller.AllServices);
            return sequence_manager;
        }
    };
    const child_class_exp1 = class extends mixer_1.Parent().with(m_controller_1.M_Controller, m_controller_events_1.M_ControllerEvents) {
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
            this.get_Controller().announce(t_controller_1.e_Scope.Global, c_controller_1.C_Controller.AllServices, c_controller_1.C_BootState.ListenReady, 300);
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
        c_controller_1.C_BootState.ClassReady,
        c_controller_1.C_BootState.ListenReady
    ]);
});
//# sourceMappingURL=m_controller_events.test.js.map