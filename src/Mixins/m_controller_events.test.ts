
/* ////////////////////////////////////////////////////////////////////////////
 *
 *	IMPORTS
 *
 * ///////////////////////////////////////////////////////////////////////// */

import { M_ControllerEvents } from "./m_controller_events";
import { Parent } from "@utkusarioglu/mixer";
import { t_namespace } from "@utkusarioglu/namespace";
import { t_sequenceStep, e_Scope, t_transmission } from "../Common/t_controller";
import {
    C_BootState,
    C_StartupTalk,
    C_Controller
} from "../Common/c_controller";
import { Controller } from "../Controller/controller";
import { t_trackRecord } from "@utkusarioglu/state/t_state";
import { M_Controller } from "./m_controller";






/* ////////////////////////////////////////////////////////////////////////////
 *
 *	DOMESTICS
 *
 * ///////////////////////////////////////////////////////////////////////// */

test("App.initialize_Controller", () => {

    const app_class_expression = class extends Parent().with(
        M_Controller,
        M_ControllerEvents
    ) {

        constructor() {
            super();
            this.set_ControllerEvents();
        }

        public get_GlobalNamespace(): string {
            return C_Controller.AllServices;
        }

        public has_LocalNamespace(): boolean {
            return false;
        }

        private set_ControllerEvents(): void {
            this
                .initialize_Controller();
                //.manage_BootUp();
        }
    };


    const controller = new Controller("Observer");

    const subscription = new Promise((resolve) => {
        controller.subscribe(
            e_Scope.Global,
            C_Controller.AllServices,
            C_BootState.ClassReady,
            (transmission: t_transmission) => {
                resolve(transmission.Talk)
            }
        )
    });

    const app_instance = new app_class_expression();

    return expect(subscription).resolves.toBe(C_BootState.ClassReady);

});


test("Child.announce", () => {

    const child_class_exp1 = class extends Parent().with(
        M_Controller,
        M_ControllerEvents
    ) {

        constructor() {
            super();
            this.set_ControllerEvents();

        }

        get_GlobalNamespace(): string {
            return "Child/Class/1"
        }

        has_LocalNamespace(): boolean {
            return false;
        }

        private set_ControllerEvents(): void {
            this
                .initialize_Controller();
            //this.announce_ListenReady();
        }

        private announce_ListenReady() {
            this.get_Controller().announce(
                e_Scope.Global,
                C_Controller.AllServices,
                C_BootState.ListenReady,
                3000
            )
        }

    }

    const controller = new Controller("Observer");
    const response = new Promise((resolve) => {
        controller.subscribe(
            e_Scope.Global,
            C_Controller.AllServices,
            C_BootState.ClassReady,
            (transmission: t_transmission) => {
                resolve(transmission.Talk);
            }
        );
    });

    const child1 = (new child_class_exp1());

    return expect(response).resolves.toBe(C_BootState.ClassReady);

});



test("App_Controller", () => {

    Controller.flush_GlobalController();

    const app_class_expression = class extends Parent().with(
        M_Controller,
        M_ControllerEvents
    ) {

        constructor() {
            super();
            this.set_ControllerEvents();
        }

        public get_GlobalNamespace(): string {
            return C_Controller.AllServices;
        }

        public has_LocalNamespace(): boolean {
            return false;
        }

        private set_ControllerEvents(): void {
            this
                .initialize_Controller();
                //.manage_BootUp();
        }

        public manage_BootUp(): Promise<string> {

            const sequence_members: t_namespace[] =
                this.get_Controller().get_GlobalNamespaces();

            const sequence_steps: t_sequenceStep[] = [
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


            const sequence_manager = this.manage_ControllerSequence(
                sequence_steps,
                e_Scope.Global,
                C_Controller.AllServices,
            )

            //return Promise.resolve(JSON.stringify(sequence_manager));

            return sequence_manager;

        } // Manage_BootUp

    };



    const child_class_exp1 = class extends Parent().with(
        M_Controller,
        M_ControllerEvents
    ) {

        constructor() {
            super();
            this.set_ControllerEvents();

        }

        get_GlobalNamespace(): string {
            return "Child/Class/1"
        }

        has_LocalNamespace(): boolean {
            return false;
        }

        private set_ControllerEvents(): void {
            this
                .initialize_Controller();
            //this.announce_ListenReady();
        }

        private announce_ListenReady() {
            this.get_Controller().announce(
                e_Scope.Global,
                C_Controller.AllServices,
                C_BootState.ListenReady,
                300
            )
        }

    }

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
