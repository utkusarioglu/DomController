"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("./controller");
const c_controller_1 = require("../Common/c_controller");
test("Controller.listen&talk.Global", () => {
    const namespace = "namespace";
    const c = new controller_1.Controller(namespace);
    const subscribed_namespace = "subscribed/namespace";
    const data = "data";
    const listen = new Promise((resolve) => {
        c.subscribe(subscribed_namespace, c_controller_1.C_StartupTalk.send_Archive, (transmission) => {
            resolve(transmission.Talk[2][0]);
        });
    });
    c.announce(subscribed_namespace, [...c_controller_1.C_StartupTalk.send_Archive, [data]]);
    return expect(listen).resolves.toBe(data);
});
test("Controller.service.global", () => {
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