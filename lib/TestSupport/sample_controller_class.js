"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_emitter_1 = require("@utkusarioglu/event-emitter");
const base_test_class_1 = require("./base_test_class");
const controller_1 = require("../Controller/controller");
controller_1.Controller.set_EventEmitter(event_emitter_1.EventEmitter);
exports.ActiveEmitter = event_emitter_1.EventEmitter;
class SampleControllerClass extends base_test_class_1.BaseTestClass {
    constructor(class_namespace, channel = "channel/namespace") {
        super(class_namespace, channel);
        this._sample_namespace = class_namespace;
        this.channel = channel;
        this.set_Controller();
    }
}
exports.SampleControllerClass = SampleControllerClass;
;
//# sourceMappingURL=sample_controller_class.js.map