"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("../Controller/controller");
const sample_controller_events_class_1 = require("../TestSupport/sample_controller_events_class");
const c_controller_1 = require("../Common/c_controller");
const t_controller_1 = require("../Common/t_controller");
const sample_controller_class_1 = require("../TestSupport/sample_controller_class");
const resolver_1 = require("@utkusarioglu/resolver");
controller_1.Controller.set_EventEmitter(sample_controller_class_1.ActiveEmitter);
test("skip", () => {
    expect(2).toStrictEqual(2);
});
test("App.Controller events participants", () => {
    controller_1.Controller.flush_GlobalController();
    const listenting_controller = new controller_1.Controller("Observer");
    const subscription = new Promise((resolve) => {
        listenting_controller.subscribe(c_controller_1.C_BootState.ClassReady, (transmission) => {
            resolve(transmission.Talk);
        }, c_controller_1.C_Controller.AllServices);
    });
    const talker_class = new sample_controller_events_class_1.SampleControllerEventsClass("Talker", c_controller_1.C_Controller.AllServices, false);
    talker_class.initialize_Controller();
    const participants = controller_1.Controller.get_GlobalNamespaces();
    expect(participants).toStrictEqual(["Observer", "Talker"]);
});
test("App.Class Ready manual", () => {
    controller_1.Controller.flush_GlobalController();
    const listenting_controller = new controller_1.Controller("Observer");
    const talking_controller = new controller_1.Controller("Class");
    const subscription = new Promise((resolve) => {
        listenting_controller.subscribe(c_controller_1.C_BootState.ClassReady, (transmission) => {
            resolve(transmission.Talk);
        }, c_controller_1.C_Controller.AllServices);
    });
    talking_controller.announce(c_controller_1.C_Controller.AllServices, c_controller_1.C_BootState.ClassReady, t_controller_1.e_Scope.Global, 0);
    return expect(subscription).resolves.toBe(c_controller_1.C_BootState.ClassReady);
});
test("App.Class Ready, late announce", () => {
    controller_1.Controller.flush_GlobalController();
    const listenting_controller = new controller_1.Controller("Observer");
    const talking_controller = new controller_1.Controller("Class");
    const subscription = new Promise((resolve) => {
        listenting_controller.subscribe(c_controller_1.C_BootState.ClassReady, (transmission) => {
            resolve(transmission.Talk);
        }, c_controller_1.C_Controller.AllServices);
    });
    talking_controller.announce(c_controller_1.C_Controller.AllServices, c_controller_1.C_BootState.ClassReady, undefined, 500);
    return expect(subscription).resolves.toBe(c_controller_1.C_BootState.ClassReady);
});
test("App.SampleControllerEventsClass listen/talk", () => {
    controller_1.Controller.flush_GlobalController();
    const message = "this is the message";
    const channel = c_controller_1.C_Controller.AllServices;
    const listener_namespace = "listener/namespace";
    const talker_namespace = "talker/namespace";
    const listener_instance = new sample_controller_events_class_1.SampleControllerEventsClass(listener_namespace, channel, false);
    const talker_instance = new sample_controller_events_class_1.SampleControllerEventsClass(talker_namespace, channel, false);
    listener_instance.set_SampleController();
    talker_instance.set_SampleController();
    const listener = listener_instance.listen();
    const talker = talker_instance.talk(message);
    const listener_message = listener.then((transimission) => {
        return resolver_1.Resolution.extract_Argument(transimission.Talk);
    });
    return expect(listener_message).resolves.toStrictEqual(message);
});
test("App.SampleControllerEventsClass listen/talk", () => {
    controller_1.Controller.flush_GlobalController();
    const message = "this is the message";
    const channel = c_controller_1.C_Controller.AllServices;
    const listener_namespace = "listener/namespace";
    const talker_namespace = "talker/namespace";
    const listener_instance = new sample_controller_events_class_1.SampleControllerEventsClass(listener_namespace, channel, false);
    const talker_instance = new sample_controller_events_class_1.SampleControllerEventsClass(talker_namespace, channel, false);
    listener_instance.set_SampleController();
    talker_instance.set_SampleController();
    const listener = listener_instance.listen();
    const talker = talker_instance.announce_ClassReady();
    const listener_talk = listener.then((transimission) => {
        return transimission.Talk;
    });
    return expect(listener_talk).resolves.toStrictEqual(c_controller_1.C_BootState.ClassReady);
});
test("App.SampleControllerEventsClass set_ControllerEvents", () => {
    controller_1.Controller.flush_GlobalController();
    const message = "this is the message";
    const channel = c_controller_1.C_Controller.AllServices;
    const listener_namespace = "listener/namespace";
    const talker_namespace = "talker2/namespace";
    const listener_instance = new sample_controller_events_class_1.SampleControllerEventsClass(listener_namespace, channel, false);
    const talker_instance = new sample_controller_events_class_1.SampleControllerEventsClass(talker_namespace, channel, false);
    listener_instance.set_SampleController();
    const listener = listener_instance.listen();
    const talker = talker_instance.set_ControllerEvents();
    const listener_talk = listener.then((transimission) => {
        return transimission.Talk;
    });
    return expect(listener_talk).resolves.toStrictEqual(c_controller_1.C_BootState.ClassReady);
});
//# sourceMappingURL=m_controller_events.test.js.map