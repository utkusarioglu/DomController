import { EventEmitter } from "@utkusarioglu/event-emitter";
import { t_ri0 } from "@utkusarioglu/resolver";
import { M_Controller } from "../Mixins/m_controller";
import { t_namespace } from "@utkusarioglu/namespace";
import { i_talk, i_Response } from "../Common/t_controller";
export declare const ActiveEmitter: typeof EventEmitter;
export declare abstract class BaseTestClass extends M_Controller {
    protected _sample_namespace: string;
    channel: t_namespace;
    constructor(class_namespace: string, channel?: t_namespace);
    get_GlobalNamespace(): string;
    has_LocalNamespace(): boolean;
    get_ControllerNamespace(): string;
    get_ClassEventEmitter(): EventEmitter;
    listen(): Promise<i_talk<t_ri0>>;
    talk(message: any): void;
    request(channel: t_namespace, message: string): Promise<i_Response<string>>;
    respond(addition: string): void;
}
