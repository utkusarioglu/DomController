
/* ////////////////////////////////////////////////////////////////////////////
 *
 *	IMPORTS
 *
 * ///////////////////////////////////////////////////////////////////////// */

/*
 *	LOCALS
 */
import { Controller } from "./controller";
import { SampleControllerClass, ActiveEmitter } from "../TestSupport/sample_controller_class"

/*
 *	CONSTANTS
 */
import { C_StartupTalk } from "../Common/c_controller";

/*
 *	DATATYPES
 */
import { e_Scope, i_talk, i_request, i_response } from "../Common/t_controller";
import { t_ri, Resolution, t_ri0 } from "@utkusarioglu/resolver";






/* ////////////////////////////////////////////////////////////////////////////
 *
 *	DOMESTICS
 *
 * ///////////////////////////////////////////////////////////////////////// */

// this would need to be declared only once in production, not in every module
Controller.set_EventEmitter(ActiveEmitter);




test("Single Controller.listen&talk.Global", () => {

    Controller.flush_GlobalController();

    const namespace = "namespace";
    const c = new Controller(namespace);
    const subscribed_namespace = "subscribed/namespace";
    const data = "data";

    const listen = new Promise((resolve) => {
        c.subscribe<t_ri<[typeof data]>>(
            C_StartupTalk.send_Archive,
            (transmission) => {
                resolve((Resolution.extract_Argument(transmission.Talk)));
            },
            subscribed_namespace,
            //e_Scope.Global,
        );
    });

    c.announce(
        subscribed_namespace,
        [...C_StartupTalk.send_Archive, [data]] as t_ri<[typeof data]>,
    );

    return expect(listen).resolves.toBe(data);

});

test("Controller.listen&talk.Global", () => {
    Controller.flush_GlobalController();

    const subscriber_namespace = "subscriber/namespace";
    const announcer_namespace = "announcer/namespace";
    const subscriber = new Controller(subscriber_namespace);
    const announcer = new Controller(announcer_namespace);
    const subscribed_namespace = "subscribed/namespace";
    const data: string = "data";

    const listen = new Promise((resolve) => {
        subscriber.subscribe(
            C_StartupTalk.send_Archive,
            (transmission: i_talk<t_ri0>) => {
                resolve((Resolution.extract_Argument(transmission.Talk)));
            },
            subscribed_namespace,
            //e_Scope.Global,
        );
    });

    announcer.announce(
        subscribed_namespace,
        [...C_StartupTalk.send_Archive, [data]] as t_ri<[typeof data]>,
    );

    return expect(listen).resolves.toBe(data);

});



test("Controller.service.global", () => {
    Controller.flush_GlobalController();

    const consuming_namespace = "namespace/consuming";
    const consuming_controller = new Controller(consuming_namespace);
    const service_namespace = "service/namespace";
    const service_controller = new Controller(service_namespace);
    const response_data = "response_data";

    service_controller.respond<string>(
        (transmission) => {
            return Promise.resolve(response_data);
        },
        //false,
        //e_Scope.Global,
    );

    const response = consuming_controller.request<string>(
        service_namespace,
        ["RI", "do_Something"],
        //e_Scope.Global,
    ).
        then((transmission: i_response<string>) => {
            return transmission.Content;
        });

    return expect(response).resolves.toStrictEqual(response_data);

});
