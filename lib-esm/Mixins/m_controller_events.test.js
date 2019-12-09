import { Controller } from "../Controller/controller";
import { SampleControllerEventsClass } from "../TestSupport/sample_controller_events_class";
import { C_BootState, C_Controller } from "../Common/c_controller";
import { e_Scope } from "../Common/t_controller";
import { Resolution } from "@utkusarioglu/resolver";
test("skip", () => {
    expect(2).toStrictEqual(2);
});
test("App.Controller events participants", () => {
    Controller.flush_GlobalController();
    const listenting_controller = new Controller("Observer");
    const subscription = new Promise((resolve) => {
        listenting_controller.subscribe(C_BootState.ClassReady, (transmission) => {
            resolve(transmission.Talk);
        }, C_Controller.AllServices);
    });
    const talker_class = new SampleControllerEventsClass("Talker", C_Controller.AllServices, false);
    talker_class.initialize_Controller();
    const participants = Controller.get_GlobalNamespaces();
    expect(participants).toStrictEqual(["Observer", "Talker"]);
});
test("App.Class Ready manual", () => {
    Controller.flush_GlobalController();
    const listenting_controller = new Controller("Observer");
    const talking_controller = new Controller("Class");
    const subscription = new Promise((resolve) => {
        listenting_controller.subscribe(C_BootState.ClassReady, (transmission) => {
            resolve(transmission.Talk);
        }, C_Controller.AllServices);
    });
    talking_controller.announce(C_Controller.AllServices, C_BootState.ClassReady, e_Scope.Global, 0);
    return expect(subscription).resolves.toBe(C_BootState.ClassReady);
});
test("App.Class Ready, late announce", () => {
    Controller.flush_GlobalController();
    const listenting_controller = new Controller("Observer");
    const talking_controller = new Controller("Class");
    const subscription = new Promise((resolve) => {
        listenting_controller.subscribe(C_BootState.ClassReady, (transmission) => {
            resolve(transmission.Talk);
        }, C_Controller.AllServices);
    });
    talking_controller.announce(C_Controller.AllServices, C_BootState.ClassReady, undefined, 500);
    return expect(subscription).resolves.toBe(C_BootState.ClassReady);
});
test("App.SampleControllerEventsClass listen/talk", () => {
    Controller.flush_GlobalController();
    const message = "this is the message";
    const channel = C_Controller.AllServices;
    const listener_namespace = "listener/namespace";
    const talker_namespace = "talker/namespace";
    const listener_instance = new SampleControllerEventsClass(listener_namespace, channel, false);
    const talker_instance = new SampleControllerEventsClass(talker_namespace, channel, false);
    listener_instance.set_SampleController();
    talker_instance.set_SampleController();
    const listener = listener_instance.listen();
    const talker = talker_instance.talk(message);
    const listener_message = listener.then((transimission) => {
        return Resolution.extract_Argument(transimission.Talk);
    });
    return expect(listener_message).resolves.toStrictEqual(message);
});
test("App.SampleControllerEventsClass listen/talk", () => {
    Controller.flush_GlobalController();
    const message = "this is the message";
    const channel = C_Controller.AllServices;
    const listener_namespace = "listener/namespace";
    const talker_namespace = "talker/namespace";
    const listener_instance = new SampleControllerEventsClass(listener_namespace, channel, false);
    const talker_instance = new SampleControllerEventsClass(talker_namespace, channel, false);
    listener_instance.set_SampleController();
    talker_instance.set_SampleController();
    const listener = listener_instance.listen();
    const talker = talker_instance.announce_ClassReady();
    const listener_talk = listener.then((transimission) => {
        return transimission.Talk;
    });
    return expect(listener_talk).resolves.toStrictEqual(C_BootState.ClassReady);
});
test("App.SampleControllerEventsClass set_ControllerEvents", () => {
    Controller.flush_GlobalController();
    const message = "this is the message";
    const channel = C_Controller.AllServices;
    const listener_namespace = "listener/namespace";
    const talker_namespace = "talker2/namespace";
    const listener_instance = new SampleControllerEventsClass(listener_namespace, channel, false);
    const talker_instance = new SampleControllerEventsClass(talker_namespace, channel, false);
    listener_instance.set_SampleController();
    const listener = listener_instance.listen();
    const talker = talker_instance.set_ControllerEvents();
    const listener_talk = listener.then((transimission) => {
        return transimission.Talk;
    });
    return expect(listener_talk).resolves.toStrictEqual(C_BootState.ClassReady);
});
//# sourceMappingURL=m_controller_events.test.js.map