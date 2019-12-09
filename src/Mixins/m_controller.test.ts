
/* ////////////////////////////////////////////////////////////////////////////
 *
 *	IMPORTS
 *
 * ///////////////////////////////////////////////////////////////////////// */

/*
 *	DEPENDENCIES
 */
import { Parent } from "@utkusarioglu/mixer";    
import { M_Namespace, t_namespace } from "@utkusarioglu/namespace";
import { t_ri0, Resolution, t_ri1 } from "@utkusarioglu/resolver";

/*
 *	LOCALS
 */
import { M_Controller } from "./m_controller";
import { Controller } from "../Controller/controller";
import { SampleControllerClass, ActiveEmitter } from "../TestSupport/sample_controller_class"

/*
 *	DATATYPES
 */
import { i_talk, i_request, i_response } from "../Common/t_controller";


/* ////////////////////////////////////////////////////////////////////////////
 *
 *	DOMESTICS
 *
 * ///////////////////////////////////////////////////////////////////////// */

test("App get event emitter static", () => {

    const ee = Controller.get_EventEmitter();

    expect(ee).toBe(ActiveEmitter);

});

test("App get event emitter static", () => {

    const ee = (new Controller("test/namespace")).get_EventEmitter();

    expect(ee).toBe(ActiveEmitter);

});

test("App get EE inside class", () => {
    const ee = new SampleControllerClass("Test/class").get_ClassEventEmitter();
    expect(ee).toBe(ActiveEmitter);
});



test("get_Set_Controller", () => {

    const sample_namespace = "sample/namespace";
    const response = (new SampleControllerClass(sample_namespace))
        .get_ControllerNamespace();

    expect(response).toStrictEqual(sample_namespace);
});

test("Global namespaces in base", () => {

    Controller.flush_GlobalController();

    let classes: { [class_name: string]: any } = {};

    for (let i = 1; i < 4; i++) {
        const class_name: string  = "controller-" + i;
        classes[class_name] = new Controller(class_name);

    }

    const response = Controller.get_GlobalNamespaces();

    expect(response).toStrictEqual(Object.keys(classes));

});

test("Global namespaces in class", () => {

    Controller.flush_GlobalController();

    let classes: { [class_name: string]: any } = {};

    for (let i = 1; i < 4; i++) {
        const class_name: string  = "class-" + i;
        classes[class_name] = new SampleControllerClass(class_name);

    }

    const response = Controller.get_GlobalNamespaces();

    expect(response).toStrictEqual(Object.keys(classes));

});

test("Controller - Global namespace list from mixed sources", () => {

    Controller.flush_GlobalController();

    const message: string = "this is the message";
    const channel: t_namespace = "channel/namespace";
    const listener_namespace: t_namespace = "listener/namespace";
    const talker_namespace: t_namespace = "talker/namespace";

    const listener = new SampleControllerClass(listener_namespace);
    const baser = new Controller(talker_namespace);
    const response = Controller.get_GlobalNamespaces();

    expect(response).toStrictEqual([listener_namespace, talker_namespace]);

});

test("Controller - listen/talk from separate classes", () => {

    Controller.flush_GlobalController();

    const message: string = "this is the message";
    const channel: t_namespace = "channel/namespace";
    const listener_namespace: t_namespace = "listener/namespace";
    const talker_namespace: t_namespace = "talker/namespace";

    const listener_instance = new SampleControllerClass(listener_namespace, channel);
    const talker_instance = new SampleControllerClass(talker_namespace, channel);

    const listener = listener_instance.listen();
    const talker = talker_instance.talk(message);

    const listener_message = listener.then((transimission: any) => {
        return Resolution.extract_Argument(transimission.Talk);
    });

    return expect(listener_message).resolves.toStrictEqual(message)
});

test("Controller - service from separate classes", () => {
    Controller.flush_GlobalController();

    const message: string = "message";
    const addition: string = "--";
    const channel: t_namespace = "channel/namespace";

    const requester_namespace: t_namespace = "requester/namespace";
    const responder_namespace: t_namespace = "responder/namespace";

    const requester_instance = new SampleControllerClass(requester_namespace);
    const responder_instance = new SampleControllerClass(responder_namespace);

    responder_instance.respond(addition);
    const result = requester_instance.request(responder_namespace, message)
        .then((transmission: i_response<string>) => {
            return transmission.Content;
        });

    return expect(result).resolves.toStrictEqual(message + addition);
});