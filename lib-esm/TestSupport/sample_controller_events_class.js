import { Parent } from "@utkusarioglu/mixer";
import { M_ControllerEvents } from "../Mixins/m_controller_events";
import { BaseTestClass } from "./base_test_class";
import { C_BootState } from "../Common/c_controller";
export class SampleControllerEventsClass extends Parent(BaseTestClass).with(M_ControllerEvents) {
    constructor(class_namespace, channel = "channel", sequential = true) {
        super(class_namespace, channel);
    }
    set_ControllerEvents() {
        this.initialize_Controller();
        return this;
    }
    announce_ClassReady() {
        this.announce_ToAllServices(C_BootState.ClassReady);
        return this;
    }
    set_SampleController() {
        this.set_Controller();
        return this;
    }
}
//# sourceMappingURL=sample_controller_events_class.js.map