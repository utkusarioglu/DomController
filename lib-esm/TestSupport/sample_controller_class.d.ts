import { EventEmitter } from "@utkusarioglu/event-emitter";
import { M_Controller } from "../Mixins/m_controller";
import { BaseTestClass } from "./base_test_class";
import { t_namespace } from "@utkusarioglu/namespace";
export declare const ActiveEmitter: typeof EventEmitter;
export interface SampleControllerClass extends BaseTestClass, M_Controller {
}
export declare class SampleControllerClass extends BaseTestClass {
    constructor(class_namespace: string, channel?: t_namespace);
}
