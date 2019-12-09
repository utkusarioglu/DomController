
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
import { BaseTestClass } from "./base_test_class";

/*
 *	DATATYPES
 */
import { t_namespace } from "@utkusarioglu/namespace";
import { i_talk, i_response, i_request, i_EventEmitter } from "../Common/t_controller";
import { Controller } from "../Controller/controller";




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

export interface SampleControllerClass extends BaseTestClass, M_Controller { }

/**
 * Sample class for running tests
 */
export class SampleControllerClass extends BaseTestClass {

    constructor(
        class_namespace: string,
        channel: t_namespace = "channel/namespace"
    ) { 
        super(class_namespace, channel);
        this._sample_namespace = class_namespace;
        this.channel = channel;
        this.set_Controller();
    }

};