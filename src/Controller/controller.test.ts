
/* ////////////////////////////////////////////////////////////////////////////
 *
 *	IMPORTS
 *
 * ///////////////////////////////////////////////////////////////////////// */

/*
 *	DEPENDENCIES
 */
import { EventEmitter } from "@utkusarioglu/event-emitter";

/*
 *	LOCALS
 */
import { Controller } from "./controller";

/*
 *	CONSTANTS
 */
import { C_StartupTalk } from "../Common/c_controller";

/*
 *	DATATYPES
 */
import { t_transmission, e_Scope, i_talk } from "../Common/t_controller";
import { t_resolutionInstruction, Resolution, t_ri0 } from "@utkusarioglu/resolver";






/* ////////////////////////////////////////////////////////////////////////////
 *
 *	DOMESTICS
 *
 * ///////////////////////////////////////////////////////////////////////// */

Controller.set_EventEmitter(EventEmitter);



test("Controller.listen&talk.Global", () => {

    const namespace = "namespace";
    const c = new Controller(namespace);
    const subscribed_namespace = "subscribed/namespace";
    const data = "data";

    const listen = new Promise((resolve) => {
        c.subscribe(
            C_StartupTalk.send_Archive,
            (transmission: i_talk<t_ri0>) => {
                resolve((Resolution.extract_Argument(transmission.Talk)));
            },
            subscribed_namespace,
            //e_Scope.Global,
        );
    });

    c.announce(
        subscribed_namespace,
        [...C_StartupTalk.send_Archive, [data]] as t_resolutionInstruction,
        //e_Scope.Global,
    );

    return expect(listen).resolves.toBe(data);

});



test("Controller.service.global", () => {

    const consuming_namespace = "namespace/consuming";
    const consuming_controller = new Controller(consuming_namespace);
    const service_namespace = "service/namespace";
    const service_controller = new Controller(service_namespace);
    const response_data = "response_data";

    service_controller.respond(
        (transmission: t_transmission) => {
            return Promise.resolve(response_data);
        },
        //false,
        //e_Scope.Global,
    );

    const response = consuming_controller.request(
        service_namespace,
        ["RI", "do_Something"],
        //e_Scope.Global,
    ).
        then((transmission: t_transmission) => {
            return transmission.Content;
        });

    return expect(response).resolves.toStrictEqual(response_data);

});
