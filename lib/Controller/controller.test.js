"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("./controller");
const sample_controller_class_1 = require("../TestSupport/sample_controller_class");
const c_controller_1 = require("../Common/c_controller");
const resolver_1 = require("@utkusarioglu/resolver");
controller_1.Controller.set_EventEmitter(sample_controller_class_1.ActiveEmitter);
test("Single Controller.listen&talk.Global", () => {
    controller_1.Controller.flush_GlobalController();
    const namespace = "namespace";
    const c = new controller_1.Controller(namespace);
    const subscribed_namespace = "subscribed/namespace";
    const data = "data";
    const listen = new Promise((resolve) => {
        c.subscribe(c_controller_1.C_StartupTalk.send_Archive, (transmission) => {
            resolve((resolver_1.Resolution.extract_Argument(transmission.Talk)));
        }, subscribed_namespace);
    });
    c.announce(subscribed_namespace, [...c_controller_1.C_StartupTalk.send_Archive, [data]]);
    return expect(listen).resolves.toBe(data);
});
test("Controller.listen&talk.Global", () => {
    controller_1.Controller.flush_GlobalController();
    const subscriber_namespace = "subscriber/namespace";
    const announcer_namespace = "announcer/namespace";
    const subscriber = new controller_1.Controller(subscriber_namespace);
    const announcer = new controller_1.Controller(announcer_namespace);
    const subscribed_namespace = "subscribed/namespace";
    const data = "data";
    const listen = new Promise((resolve) => {
        subscriber.subscribe(c_controller_1.C_StartupTalk.send_Archive, (transmission) => {
            resolve((resolver_1.Resolution.extract_Argument(transmission.Talk)));
        }, subscribed_namespace);
    });
    announcer.announce(subscribed_namespace, [...c_controller_1.C_StartupTalk.send_Archive, [data]]);
    return expect(listen).resolves.toBe(data);
});
test("Controller.service.global", () => {
    controller_1.Controller.flush_GlobalController();
    const consuming_namespace = "namespace/consuming";
    const consuming_controller = new controller_1.Controller(consuming_namespace);
    const service_namespace = "service/namespace";
    const service_controller = new controller_1.Controller(service_namespace);
    const response_data = "response_data";
    service_controller.respond((transmission) => {
        return Promise.resolve(response_data);
    });
    const response = consuming_controller.request(service_namespace, ["RI", "do_Something"]).
        then((transmission) => {
        return transmission.Content;
    });
    return expect(response).resolves.toStrictEqual(response_data);
});
//# sourceMappingURL=controller.test.js.map