import { BaseController } from "./base_controller";
import { e_Scope, t_transmission, t_waitSet, e_ServiceGroup } from "../Common/t_controller";
import { t_resolutionInstruction } from "@utkusarioglu/resolver";
import { C_BootState } from "../Common/c_controller";
import { EventEmitter } from "events";




/*
 * ======================================================= Boundary 1 =========
 *
 *	TESTS
 *
 * ============================================================================
 */



test("EventEmitter", () => {

    const ee = new EventEmitter();
    const channel = "thing";
    const transmission_value = "transmission_value";

    const on_promise = new Promise((resolve, reject) => {
        ee.on(channel, (transmission) => {
            resolve(transmission);
        });
    });
    ee.emit(channel, transmission_value);

    return expect(on_promise).resolves.toBe(transmission_value);

});




// method get_Separator is normally protected, check its access 
// before running this test
// test("BaseController.SeparatorHandler.get_Separator", () => {

//    const base_controller_ins = new BaseController(e_Scope.Global);
//    const expression_sep = base_controller_ins.get_Separator("Expression");

//    expect(expression_sep).toBe(".");

// });

test("BaseController.subscribe&announce.Global", () => {

    const namespace = "subscribed/namespace";
    const base_controller = new BaseController(e_Scope.Global);

    const subscription = new Promise((resolve, reject) => {
        base_controller.subscribe(
            e_Scope.Global,
            namespace,
            C_BootState.ClassReady,
            (transmission: t_transmission) => {
                resolve(transmission.Talk);
            },
        );

    });

    base_controller.announce(
        e_Scope.Global,
        "base_controller2",
        namespace,
        C_BootState.ClassReady,
    );

    return expect(subscription).resolves.toStrictEqual(C_BootState.ClassReady);

});


test("BaseController.subscribe&announce.Local", () => {

    const namespace = "subscribed/namespace";
    const base_controller = new BaseController(e_Scope.Local);

    const subscription = new Promise((resolve, reject) => {
        base_controller.subscribe(
            e_Scope.Local,
            namespace,
            C_BootState.ClassReady,
            (transmission: t_transmission) => {
                resolve(transmission.Talk);
            },
        );

    });

    base_controller.announce(
        e_Scope.Local,
        "base_controller2",
        namespace,
        C_BootState.ClassReady,
    );

    return expect(subscription).resolves.toStrictEqual(C_BootState.ClassReady);

});


test("BaseController.wait", () => {

    const declaration_namespace = "declaration/namespace";
    const base_controller = new BaseController(e_Scope.Local);
    const test_value = "test-value";
    let announcement_count: number = 0;

    const wait_promise = new Promise((resolve) => {
        base_controller.wait(
            e_Scope.Local,
            "waiting/for/emit",
            declaration_namespace,
            C_BootState.ClassReady,
            (transmission: t_transmission) => {
                announcement_count++;
                return (transmission.Talk as t_resolutionInstruction)[2][0]
                    === test_value;
            },
            (transmission: t_transmission) => {
                resolve(announcement_count);
            },
        );
    });

    base_controller.announce(
        e_Scope.Local,
        "base/controller/2",
        declaration_namespace,
        [...C_BootState.ClassReady, ["not-test-value"] ] as t_resolutionInstruction,
    );

    base_controller.announce(
        e_Scope.Local,
        "base/controller/3",
        declaration_namespace,
        [...C_BootState.ClassReady, ["not-test-value"] ] as t_resolutionInstruction,
    );

   
    base_controller.announce(
        e_Scope.Local,
        "base/controller/2",
        declaration_namespace,
        [...C_BootState.ClassReady, [test_value]] as t_resolutionInstruction,
    );

    return expect(wait_promise).resolves.toStrictEqual(3);

});



test("BaseController.wait_Some", () => {

    const base_controller = new BaseController(e_Scope.Global);

    const declaration_namespace1 = "declaration/namespace/1";
    const declaration_namespace2 = "declaration/namespace/2";
    const test_value1 = "test-value-1";
    const test_value2 = "test-value-2";
    let announcement_count: number = 0;


    const wait_some = base_controller.wait_Some(
        e_Scope.Global,
        "waiter/namespace",
        [
            {
                Namespace: declaration_namespace1,
                Listen: C_BootState.ClassReady,
                Test: (transmission: t_transmission) => {
                    announcement_count++;
                    return (transmission.Talk as t_resolutionInstruction)[2][0]
                        === test_value1;
                },
            },
            {
                Namespace: declaration_namespace2,
                Listen: C_BootState.ClassReady,
                Test: (transmission: t_transmission) => {
                    announcement_count++;
                    return (transmission.Talk as t_resolutionInstruction)[2][0]
                        === test_value2;
                },
            },
        ] as t_waitSet[],
    ).then((transmissions: t_transmission[]) => {
        return transmissions.map((transmission) => {
            return (transmission.Talk as t_resolutionInstruction)[2][0];
        });
    });

    base_controller.announce(
        e_Scope.Global,
        "1",
        declaration_namespace1,
        [...C_BootState.ClassReady, [test_value1]] as t_resolutionInstruction,
    );

    base_controller.announce(
        e_Scope.Global,
        "2",
        declaration_namespace2,
        [...C_BootState.ClassReady, ["not-test-value"]] as t_resolutionInstruction,
    );

    base_controller.announce(
        e_Scope.Global,
        "2",
        declaration_namespace2,
        [...C_BootState.ClassReady, [test_value2]] as t_resolutionInstruction,
    );

    // console.log("wait_some\n", wait_some);

    return expect(wait_some).resolves.toStrictEqual([test_value1, test_value2]);

});


test("Basecontroller.service", () => {

    const base_controller = new BaseController(e_Scope.Global);
    const responder_namespace = "responder/namespace";
    const sender_namespace = "sender/namespace";

    base_controller.respond(
        responder_namespace,
        (transmission: t_transmission) => {
            return new Promise((resolve) => {
                resolve(transmission);
            });
        },
        e_ServiceGroup.Standard,
        e_Scope.Global,
    );

    const response = base_controller.request(
        e_Scope.Global,
        sender_namespace,
        responder_namespace,
        ["RI", "set_Banana"],
        e_ServiceGroup.Standard,
    )
        .then((transmission: t_transmission) => {
            return (transmission.Content as t_transmission).Time;
        });

    return expect(response).resolves.toBeGreaterThan(1000);


});

