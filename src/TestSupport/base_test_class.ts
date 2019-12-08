
/* ////////////////////////////////////////////////////////////////////////////
 *
 *	IMPORTS
 *
 * ///////////////////////////////////////////////////////////////////////// */

/*
 *	DEPENDENCIES
 */
//import { EventEmitter } from "events";
import { EventEmitter } from "@utkusarioglu/event-emitter";
import { t_ri0, Resolution } from "@utkusarioglu/resolver";

/*
 *	LOCALS
 */
import { M_Controller } from "../Mixins/m_controller"

/*
 *	DATATYPES
 */
import { t_namespace } from "@utkusarioglu/namespace";
import { i_talk, i_Response, i_Request } from "../Common/t_controller";
import { Controller } from "../Controller/controller";
import { C_BootState } from "../Common/c_controller";




/**
 * Sets the event emitter for the controller
 */
Controller.set_EventEmitter(EventEmitter);



/* ////////////////////////////////////////////////////////////////////////////
 *
 *	EXPORTS
 *
 * ///////////////////////////////////////////////////////////////////////// */

/**
 * Emitter that is currently being used
 */
export const ActiveEmitter = EventEmitter;

/**
 * Sample class for running tests
 */
export abstract class BaseTestClass extends M_Controller {

    protected _sample_namespace: string;
    public channel: t_namespace;

    constructor(
        class_namespace: string,
        channel: t_namespace = "channel/namespace"
    ) { 
        super();
        this._sample_namespace = class_namespace;
        this.channel = channel;
    }

    public get_GlobalNamespace(): string {
        return this._sample_namespace;
    }

    public has_LocalNamespace(): boolean {
        return false;
    }

    public get_ControllerNamespace(): string {
        return this.get_Controller().get_GlobalNamespace();
    }

    public get_ClassEventEmitter(): EventEmitter {
        return this.get_Controller().get_EventEmitter();
    }

    public listen(): Promise<i_talk<t_ri0>> {
        return new Promise((resolve) => {
            this.get_Controller()
                .subscribe(
                    C_BootState.ClassReady,
                    (transmission: i_talk<t_ri0>) => {
                        resolve(transmission);
                    },
                    this.channel
                )

        });
    }

    public talk(message: any): void {
        this.get_Controller().announce(
            this.channel,
            [...C_BootState.ClassReady, [message]] as t_ri0,
            undefined,
            100
        );
    }

    public request(channel:t_namespace, message: string): Promise<i_Response<string>> {
        return this.get_Controller().request(
            channel,
            ["RI", "request()", [message]]
        );
    }

    public respond(addition: string): void {
        this.get_Controller().respond((transmission: i_Request) => {
            const message = Resolution.extract_Argument(transmission.Talk);
            return Promise.resolve(message + addition);
        })
    }

};