import { SampleControllerClass } from "./sample_controller_class";
import { t_namespace } from "@utkusarioglu/namespace";
import { M_ControllerEvents } from "../Mixins/m_controller_events";
import { M_Controller } from "../Mixins/m_controller";
export interface SampleControllerEventsClass extends SampleControllerClass, M_ControllerEvents, M_Controller {
}
declare const SampleControllerEventsClass_base: any;
export declare class SampleControllerEventsClass extends SampleControllerEventsClass_base {
    constructor(class_namespace: t_namespace, channel?: t_namespace, sequential?: boolean);
    set_ControllerEvents(): this;
    announce_ClassReady(): this;
    set_SampleController(): this;
}
export {};
