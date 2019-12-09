
/* ////////////////////////////////////////////////////////////////////////////
 *
 *	IMPORTS
 *
 * ///////////////////////////////////////////////////////////////////////// */

/*
 *	DEPENDENCIES
 */
import { t_trackRecord } from "@utkusarioglu/state/t_state";
import { Parent } from "@utkusarioglu/mixer";

/*
 *	LOCALS
 */
import { M_ControllerEvents } from "./m_controller_events";
import { Controller } from "../Controller/controller";
import { M_Controller } from "./m_controller";
import { SampleControllerEventsClass } from "../TestSupport/sample_controller_events_class";

/*
 *	CONSTANTS
 */
import {
    C_BootState,
    C_StartupTalk,
    C_Controller
} from "../Common/c_controller";

/*
 *	DATATYPES
 */
import { t_namespace } from "@utkusarioglu/namespace";
import { i_sequenceStep, e_Scope, t_transmission } from "../Common/t_controller";
import { ActiveEmitter } from "../TestSupport/sample_controller_class";
import { Resolution } from "@utkusarioglu/resolver";






/* ////////////////////////////////////////////////////////////////////////////
 *
 *	DOMESTICS
 *
 * ///////////////////////////////////////////////////////////////////////// */

test("skip", () => {
    expect(2).toStrictEqual(2)
})

test("App.Controller events participants", () => {

    Controller.flush_GlobalController();

    const listenting_controller = new Controller("Observer");

    const subscription = new Promise((resolve) => {
        listenting_controller.subscribe(
            C_BootState.ClassReady,
            (transmission) => {
                resolve(transmission.Talk)
            },
            C_Controller.AllServices,
        )
    });

    const talker_class = new SampleControllerEventsClass(
        "Talker",
        C_Controller.AllServices,
        false
    );
    talker_class.initialize_Controller();

    const participants = Controller.get_GlobalNamespaces();

    expect(participants).toStrictEqual(["Observer", "Talker"])

});


test("App.Class Ready manual", () => {

    Controller.flush_GlobalController();

    const listenting_controller = new Controller("Observer");
    const talking_controller = new Controller("Class");

    const subscription = new Promise((resolve) => {
        listenting_controller.subscribe(
            C_BootState.ClassReady,
            (transmission) => {
                resolve(transmission.Talk)
            },
            C_Controller.AllServices,
        )
    });

    talking_controller.announce(
            C_Controller.AllServices,
            C_BootState.ClassReady,
            e_Scope.Global,
            0,
        );

    return expect(subscription).resolves.toBe(C_BootState.ClassReady);

});


test("App.Class Ready, late announce", () => {

    Controller.flush_GlobalController();

    const listenting_controller = new Controller("Observer");
    const talking_controller = new Controller("Class");

    const subscription = new Promise((resolve) => {
        listenting_controller.subscribe<any>(
            C_BootState.ClassReady,
            (transmission) => {
                resolve(transmission.Talk)
            },
            C_Controller.AllServices,
        )
    });

    talking_controller.announce(
        C_Controller.AllServices,
        C_BootState.ClassReady,
        undefined,
        500
    )

    return expect(subscription).resolves.toBe(C_BootState.ClassReady);

});

test("App.SampleControllerEventsClass listen/talk", () => {

    Controller.flush_GlobalController();

    const message: string = "this is the message";
    const channel: t_namespace = C_Controller.AllServices;
    const listener_namespace: t_namespace = "listener/namespace";
    const talker_namespace: t_namespace = "talker/namespace";

    const listener_instance = new SampleControllerEventsClass(listener_namespace, channel, false);
    const talker_instance = new SampleControllerEventsClass(talker_namespace, channel, false);

    listener_instance.set_SampleController();
    talker_instance.set_SampleController();

    const listener = listener_instance.listen();
    const talker = talker_instance.talk(message);

    const listener_message = listener.then((transimission: any) => {
        return Resolution.extract_Argument(transimission.Talk);
    });

    return expect(listener_message).resolves.toStrictEqual(message)

});


test("App.SampleControllerEventsClass listen/talk", () => {

    Controller.flush_GlobalController();

    const message: string = "this is the message";
    const channel: t_namespace = C_Controller.AllServices;
    const listener_namespace: t_namespace = "listener/namespace";
    const talker_namespace: t_namespace = "talker/namespace";

    const listener_instance = new SampleControllerEventsClass(listener_namespace, channel, false);
    const talker_instance = new SampleControllerEventsClass(talker_namespace, channel, false);

    listener_instance.set_SampleController();
    talker_instance.set_SampleController();

    const listener = listener_instance.listen();
    const talker = talker_instance.announce_ClassReady();

    const listener_talk = listener.then((transimission: any) => {
        return transimission.Talk;
    });

    return expect(listener_talk).resolves.toStrictEqual(C_BootState.ClassReady)

});

test("App.SampleControllerEventsClass set_ControllerEvents", () => {

    Controller.flush_GlobalController();

    const message: string = "this is the message";
    const channel: t_namespace = C_Controller.AllServices;
    const listener_namespace: t_namespace = "listener/namespace";
    const talker_namespace: t_namespace = "talker2/namespace";

    const listener_instance = new SampleControllerEventsClass(listener_namespace, channel, false);
    const talker_instance = new SampleControllerEventsClass(talker_namespace, channel, false);

    listener_instance.set_SampleController();
    //talker_instance.set_SampleController();

    const listener = listener_instance.listen();
    const talker = talker_instance.set_ControllerEvents();

    const listener_talk = listener.then((transimission: any) => {
        return transimission.Talk;
    });

    return expect(listener_talk).resolves.toStrictEqual(C_BootState.ClassReady)

});

//test("Child.announce", () => {

//Controller.flush_GlobalController();

//    const child_class_exp1 = class extends Parent().with(
//        M_Controller,
//        M_ControllerEvents
//    ) {

//        constructor() {
//            super();
//            this.set_ControllerEvents();

//        }

//        get_GlobalNamespace(): string {
//            return "Child/Class/1"
//        }

//        has_LocalNamespace(): boolean {
//            return false;
//        }

//        private set_ControllerEvents(): void {
//            this
//                .initialize_Controller();
//            //this.announce_ListenReady();
//        }

//        private announce_ListenReady() {
//            this.get_Controller().announce(
//                C_Controller.AllServices,
//                C_BootState.ListenReady,
//                e_Scope.Global,
//                3000
//            )
//        }

//    }

//    const controller = new Controller("Observer");
//    const response = new Promise((resolve) => {
//        controller.subscribe(
//            C_BootState.ClassReady,
//            (transmission: t_transmission) => {
//                resolve(transmission.Talk);
//            },
//            C_Controller.AllServices,
//            e_Scope.Global,
//        );
//    });

//    const child1 = (new child_class_exp1());

//    return expect(response).resolves.toBe(C_BootState.ClassReady);

//});



//test("App_Controller", () => {

//    Controller.flush_GlobalController();

//    const app_class_expression = class extends Parent().with(
//        M_Controller,
//        M_ControllerEvents
//    ) {

//        constructor() {
//            super();
//            this.set_ControllerEvents();
//        }

//        public get_GlobalNamespace(): string {
//            return C_Controller.AllServices;
//        }

//        public has_LocalNamespace(): boolean {
//            return false;
//        }

//        private set_ControllerEvents(): void {
//            this
//                .initialize_Controller();
//                //.manage_BootUp();
//        }

//        public manage_BootUp(): Promise<string> {

//            const sequence_members: t_namespace[] =
//                this.get_Controller().get_GlobalNamespaces();

//            const sequence_steps: t_sequenceStep[] = [
//                {
//                    List: sequence_members,
//                    Listen: C_BootState.ClassReady,
//                },
//                {
//                    List: ["Child/Class/1"],
//                    Talk: C_StartupTalk.run_Listen,
//                    Listen: C_BootState.ListenReady,
//            },
//            ];


//            const sequence_manager = this.manage_ControllerSequence(
//                sequence_steps,
//                e_Scope.Global,
//                C_Controller.AllServices,
//            )

//            //return Promise.resolve(JSON.stringify(sequence_manager));

//            return sequence_manager;

//        } // Manage_BootUp

//    };



//    const child_class_exp1 = class extends Parent().with(
//        M_Controller,
//        M_ControllerEvents
//    ) {

//        constructor() {
//            super();
//            this.set_ControllerEvents();

//        }

//        get_GlobalNamespace(): string {
//            return "Child/Class/1"
//        }

//        has_LocalNamespace(): boolean {
//            return false;
//        }

//        private set_ControllerEvents(): void {
//            this
//                .initialize_Controller();
//            //this.announce_ListenReady();
//        }

//        private announce_ListenReady() {
//            this.get_Controller().announce(
//                C_Controller.AllServices,
//                C_BootState.ListenReady,
//                e_Scope.Global,
//                300
//            )
//        }

//    }

//    const manager = (new app_class_expression());

//    const child1 = (new child_class_exp1());

//    const sequence = new Promise((resolve) => {
//        setTimeout(() => {
//            resolve(manager.manage_BootUp());
//        }, 100);
//    });


//    return expect(sequence).resolves.toStrictEqual([
//        C_BootState.ClassReady,
//        C_BootState.ListenReady
//    ]);

//});
