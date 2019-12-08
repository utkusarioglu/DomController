import { EventEmitter } from "@utkusarioglu/event-emitter";
import { Resolution } from "@utkusarioglu/resolver";
import { M_Controller } from "../Mixins/m_controller";
import { Controller } from "../Controller/controller";
import { C_BootState } from "../Common/c_controller";
Controller.set_EventEmitter(EventEmitter);
export const ActiveEmitter = EventEmitter;
export class BaseTestClass extends M_Controller {
    constructor(class_namespace, channel = "channel/namespace") {
        super();
        this._sample_namespace = class_namespace;
        this.channel = channel;
    }
    get_GlobalNamespace() {
        return this._sample_namespace;
    }
    has_LocalNamespace() {
        return false;
    }
    get_ControllerNamespace() {
        return this.get_Controller().get_GlobalNamespace();
    }
    get_ClassEventEmitter() {
        return this.get_Controller().get_EventEmitter();
    }
    listen() {
        return new Promise((resolve) => {
            this.get_Controller()
                .subscribe(C_BootState.ClassReady, (transmission) => {
                resolve(transmission);
            }, this.channel);
        });
    }
    talk(message) {
        this.get_Controller().announce(this.channel, [...C_BootState.ClassReady, [message]], undefined, 100);
    }
    request(channel, message) {
        return this.get_Controller().request(channel, ["RI", "request()", [message]]);
    }
    respond(addition) {
        this.get_Controller().respond((transmission) => {
            const message = Resolution.extract_Argument(transmission.Talk);
            return Promise.resolve(message + addition);
        });
    }
}
;
//# sourceMappingURL=base_test_class.js.map