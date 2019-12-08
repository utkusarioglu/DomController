"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mixer_1 = require("@utkusarioglu/mixer");
const m_controller_events_1 = require("../Mixins/m_controller_events");
const base_test_class_1 = require("./base_test_class");
const c_controller_1 = require("../Common/c_controller");
class SampleControllerEventsClass extends mixer_1.Parent(base_test_class_1.BaseTestClass).with(m_controller_events_1.M_ControllerEvents) {
    constructor(class_namespace, channel = "channel", sequential = true) {
        super(class_namespace, channel);
    }
    set_ControllerEvents() {
        this.initialize_Controller();
        return this;
    }
    announce_ClassReady() {
        this.announce_ToAllServices(c_controller_1.C_BootState.ClassReady);
        return this;
    }
    set_SampleController() {
        this.set_Controller();
        return this;
    }
}
exports.SampleControllerEventsClass = SampleControllerEventsClass;
//# sourceMappingURL=sample_controller_events_class.js.map