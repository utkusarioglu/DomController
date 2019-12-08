"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_emitter_1 = require("@utkusarioglu/event-emitter");
const resolver_1 = require("@utkusarioglu/resolver");
const m_controller_1 = require("../Mixins/m_controller");
const controller_1 = require("../Controller/controller");
const c_controller_1 = require("../Common/c_controller");
controller_1.Controller.set_EventEmitter(event_emitter_1.EventEmitter);
exports.ActiveEmitter = event_emitter_1.EventEmitter;
class BaseTestClass extends m_controller_1.M_Controller {
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
                .subscribe(c_controller_1.C_BootState.ClassReady, (transmission) => {
                resolve(transmission);
            }, this.channel);
        });
    }
    talk(message) {
        this.get_Controller().announce(this.channel, [...c_controller_1.C_BootState.ClassReady, [message]], undefined, 100);
    }
    request(channel, message) {
        return this.get_Controller().request(channel, ["RI", "request()", [message]]);
    }
    respond(addition) {
        this.get_Controller().respond((transmission) => {
            const message = resolver_1.Resolution.extract_Argument(transmission.Talk);
            return Promise.resolve(message + addition);
        });
    }
}
exports.BaseTestClass = BaseTestClass;
;
//# sourceMappingURL=base_test_class.js.map