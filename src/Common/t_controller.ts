/*
 *	LOCAL CLASSES
 */
import { BaseController } from "../BaseController/base_controller";

/*
 *	DATATYPES
 */
import {
    t_resolutionInstructionNoArgs,
    t_resolutionInstruction,
    t_ri1,
} from "@utkusarioglu/resolver";

import { t_namespace } from "@utkusarioglu/namespace";


/*
 * ========================================================================== Boundary 1 =========
 *
 *	STAND INS
 *
 * ===============================================================================================
 */

/**
 * Number used as unix epoch
 */
export type t_epoch = number;







/*
 *	SCOPE
 */

/**
 * Legal scopes for the controller
 * 
 * Local only emits to local namespace (if defined)
 * Global emits to global namespace
 * LocalAndGlobal emits to both
 */
export enum e_Scope {
    Local = 1,
    Global = 10,
    LocalAndGlobal = 11,
}

/**
 * All legal values of e_Scope
 */
export type t_scope = e_Scope;

/**
 * Only single scope allowed
 */
export type t_singleScope = e_Scope.Local | e_Scope.Global;



/**
 * Contains specifications for the transmission error
 */
export interface t_error {

}


/**
 * Alias for string to denote channel
 */
export type t_channel = string;

/**
 * Alias for string to denote the unique service id
 */
export type t_serviceId = string;

/**
 * Stores specifications required for the wait method to run
 */
export interface t_waitSet {
    /** Namespace of the target that is being waited*/
    Namespace: t_namespace;
    /** the resolution to listen to */
    Listen: t_resolutionInstructionNoArgs;
    /** callback function to determine if the emit from the awaited meets the requirements*/
    Test?: (transmission: t_transmission) => boolean;
    /** callback to be executed once the awaited passes the test*/
    Call?: (transmission: t_transmission) => any;
}

/**
 * Alias for any to denote the content transmitted via t_transmission
 */
export type t_transmissionContent = any;


/**
 * Contains keys that are expected to be transmitted by controller methods
 */
export interface t_transmission {
    /** namespace of the sender*/
    Sender: t_namespace;
    /** namespace of the recipient*/
    Recipient: t_namespace;
    /** Redundant info for ease of access, concatenating:
     * 1- recipient namespace  
     * 2- method or announcement separator (whichever applies)
     * 3- service group
     * 4- id separator (if applies)
     * 5- id (if applies)
     */
    Channel?: t_channel;
    /** denotes the service group in service transmissions */
    Group?: e_ServiceGroup;
    /** Listening resolution involved with the transmission */
    Listen?: t_resolutionInstructionNoArgs;
    /** Talking that is involved with the transmission*/
    Talk?: t_resolutionInstruction;
    /** transmission content that is created by the responder */
    Content?: t_transmissionContent;
    /** Error content if an error occured*/
    Error?: t_error;
    /** Unique request code*/
    Id?: t_serviceId;
    /** epoch when the transmission occured */
    Time: t_epoch;
    Static: boolean;
    LastDynamicTime?: t_epoch;
    Scope: e_Scope;
}


/**
 * Datatype for instructing multiple waits followed by a call
 */
export interface t_dependency_group {
    /** 1: Local, 2 or 10: global, 3 or 11: global + local */
    Scope: t_singleScope;
    /** Dependency members to be waited*/
    Members: t_waitSet[];
    /** Callback function to be executed once all the dependencies become available*/
    Call: (value: any) => Promise<any>;
}

/**
 * Datatype for instructing monitor of a channel
 */
export interface t_subscription {
    /** 1: Local, 2 or 10: global, 3 or 11: global + local */
    Scope: t_scope;
    /** The namespace that is being subscribed to*/
    Namespace: t_namespace;
    /** Resolution that is being subscribed at */
    Listen: t_resolutionInstructionNoArgs;
    /** Callback function to be executed when the subscription emits*/
    Call: (value: any) => any;
}

/**
 * Datatype for instructing monitor of a channel followed by a call whose 
 * return is emitted to the requester
 */
export interface t_service {
    /** 1: Local, 2 or 10: global, 3 or 11: global + local */
    Scope: t_scope;
    /** Namespace that is expected to respond to the request*/
    Namespace: t_namespace;
    /** Specific method that is being requested*/
    Listen: t_resolutionInstructionNoArgs;
    /** Callback function to be executed on the response transmission*/
    Call: (value: any) => any;
    /** Whelther the service is static */
    Static?: boolean;
    /** Service group */
    Group: e_ServiceGroup;
}

/**
 * Datatype for announcing a listening channel to which multiple clases can independently 
 * send data towards, which will independently handled by the call function
 */
export interface t_reception {
    /** 1: Local, 2 or 10: global, 3 or 11: global + local */
    Scope: t_scope;
    /** Namespace that is accepting the admissions */
    Namespace?: t_namespace;
    /** Announcement resolution */
    Talk: t_resolutionInstruction;
    /** Listening resolution */
    Listen: t_resolutionInstructionNoArgs;
    /** function that will be called when another node emits to the channel (namespace + . + method) */
    Call: (value: any) => any;
}

/**
 * Datatype for instructing emit of data to a certain channel without any 
 * following listening activity by the emitter
 */
export interface t_announcement {
    /** 1: Local, 2 or 10: global, 3 or 11: global + local */
    Scope: t_scope;
    /** Namespace of the announcer*/
    Namespace: t_namespace;
    /** the resolution that will be processed by the target */
    Talk: any;
}

export enum e_ServiceGroup {
    Standard,
}

/**
 * Data structure for Controller class static content archive
 */
export interface t_staticContentArchive {
    [channel: string]: {
        [unique_request_code: string]: t_transmission,
    };
}

/**
 * Stores local controllers
 */
export interface t_localControllerStack {
    [namespace: string]: BaseController;
}




/**
 * Defines the properties necessary for executing one step
 */
export interface t_sequenceStep {
    /** Console mesage for the start of the step if enabled */
    StartMessage?: string;
    /** Console mesage for the end of the step if enabled */
    EndMessage?: string;
    /** Instruction to be listened to for determining the services' completion of the step */
    Listen: t_resolutionInstructionNoArgs;
    /** List of namespaces that are required to complete the step */
    List: t_namespace[];
    /** Instruction to announce to listening services that the step execution is shall 
     * be carried out. Some steps may not require a talk as the execution starts through 
     * some other method */
    Talk?: t_resolutionInstructionNoArgs;
}

/**
 * Generic mapping object for Controller
 */
export interface i_map<T> { [key: string]: T; }


/**
 * Sub set of t_transmission for talk event
 */
export interface t_talk<T> {
    /** namespace of the sender*/
    Sender: t_namespace;
    /** namespace of the recipient*/
    Recipient: t_namespace;
    /** Redundant info for ease of access, concatenating:
     * 1- recipient namespace  
     * 2- method or announcement separator (whichever applies)
     * 3- service group
     * 4- id separator (if applies)
     * 5- id (if applies)
     */
    Channel: t_channel;
    /** Talking that is involved with the transmission*/
    Talk: T;
    /** Error content if an error occured*/
    Error?: t_error;
    /** epoch when the transmission occured */
    Time: t_epoch;
    Static: boolean;
    Scope: e_Scope;
}