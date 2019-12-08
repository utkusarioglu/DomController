
/* ////////////////////////////////////////////////////////////////////////////
 *
 *	IMPORTS
 *
 * ///////////////////////////////////////////////////////////////////////// */

/*
 *	DEPENDENCIES
 */
import { Parent } from "@utkusarioglu/mixer";

/*
 *	LOCALS
 */
import { SampleControllerClass } from "./sample_controller_class";
import { t_namespace } from "@utkusarioglu/namespace";
import { M_ControllerEvents } from "../Mixins/m_controller_events";
import { M_Controller } from "../Mixins/m_controller";
import { BaseTestClass } from "./base_test_class";
import { C_BootState } from "../Common/c_controller";




/* ////////////////////////////////////////////////////////////////////////////
 *
 *	EXPORTS
 *
 * ///////////////////////////////////////////////////////////////////////// */

export interface SampleControllerEventsClass extends
    SampleControllerClass,
    M_ControllerEvents,
    M_Controller
{ }

export class SampleControllerEventsClass extends Parent(BaseTestClass).with(
    M_ControllerEvents
) {

    constructor(
        class_namespace: t_namespace,
        channel: t_namespace = "channel",
        sequential: boolean = true
    ) {
        super(class_namespace, channel);
        //this.set_ControllerEvents();
    }

    public set_ControllerEvents(): this {
        this.initialize_Controller();
        return this;
    }

    public announce_ClassReady(): this {
        this.announce_ToAllServices(C_BootState.ClassReady)
        return this;
    }

    public set_SampleController(): this {
        this.set_Controller();
        return this;
    }
}