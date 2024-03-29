import { Controller } from "./controller";
import { ActiveEmitter } from "../TestSupport/sample_controller_class";
import { C_StartupTalk } from "../Common/c_controller";
import { Resolution } from "@utkusarioglu/resolver";
Controller.set_EventEmitter(ActiveEmitter);
test("Single Controller.listen&talk.Global", () => {
    Controller.flush_GlobalController();
    const namespace = "namespace";
    const c = new Controller(namespace);
    const subscribed_namespace = "subscribed/namespace";
    const data = "data";
    const listen = new Promise((resolve) => {
        c.subscribe(C_StartupTalk.send_Archive, (transmission) => {
            resolve((Resolution.extract_Argument(transmission.Talk)));
        }, subscribed_namespace);
    });
    c.announce(subscribed_namespace, [...C_StartupTalk.send_Archive, [data]]);
    return expect(listen).resolves.toBe(data);
});
test("Controller.listen&talk.Global", () => {
    Controller.flush_GlobalController();
    const subscriber_namespace = "subscriber/namespace";
    const announcer_namespace = "announcer/namespace";
    const subscriber = new Controller(subscriber_namespace);
    const announcer = new Controller(announcer_namespace);
    const subscribed_namespace = "subscribed/namespace";
    const data = "data";
    const listen = new Promise((resolve) => {
        subscriber.subscribe(C_StartupTalk.send_Archive, (transmission) => {
            resolve((Resolution.extract_Argument(transmission.Talk)));
        }, subscribed_namespace);
    });
    announcer.announce(subscribed_namespace, [...C_StartupTalk.send_Archive, [data]]);
    return expect(listen).resolves.toBe(data);
});
test("Controller.service.global", () => {
    Controller.flush_GlobalController();
    const consuming_namespace = "namespace/consuming";
    const consuming_controller = new Controller(consuming_namespace);
    const service_namespace = "service/namespace";
    const service_controller = new Controller(service_namespace);
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