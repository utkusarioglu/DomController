import { EventEmitter } from "@utkusarioglu/event-emitter";
import { BaseTestClass } from "./base_test_class";
import { Controller } from "../Controller/controller";
Controller.set_EventEmitter(EventEmitter);
export const ActiveEmitter = EventEmitter;
export class SampleControllerClass extends BaseTestClass {
    constructor(class_namespace, channel = "channel/namespace") {
        super(class_namespace, channel);
        this._sample_namespace = class_namespace;
        this.channel = channel;
        this.set_Controller();
    }
}
;
//# sourceMappingURL=sample_controller_class.js.map