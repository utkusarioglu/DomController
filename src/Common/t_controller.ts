/*
 *	LOCAL CLASSES
 */
import { BaseController } from "../BaseController/base_controller";

/*
 *	DATATYPES
 */
import {
    t_resolutionInstruction,
    t_ri1,
    t_ri0,
    t_ri,
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
export interface i_error {
    // TODO
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
export interface i_waitSet<TalkArgs, Return> {
    /** Namespace of the target that is being waited*/
    Namespace: t_namespace;
    /** the resolution to listen to */
    Listen: t_ri;
    /** callback function to determine if the emit from the awaited meets the requirements*/
    Test?: t_waitTestCallback<TalkArgs>;
    /** callback to be executed once the awaited passes the test*/
    Call?: t_waitPromiseResponse<TalkArgs, Return>;
}

/**
 * Alias for any to denote the content transmitted via t_transmission
 */
export type t_transmissionContent = any;

// TODO: t_transmission event needs to be reduced to its barebones and used as an abstract interface for talk, listen, respond and other more specific events
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
    Channel: t_channel;
    /** denotes the service group in service transmissions */
    Group?: e_ServiceGroup;
    /** Listening resolution involved with the transmission */
    Listen?: t_ri;
    /** Talking that is involved with the transmission*/
    Talk?: t_resolutionInstruction;
    /** transmission content that is created by the responder */
    Content?: t_transmissionContent;
    /** Error content if an error occured*/
    Error?: i_error;
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
export interface i_dependency_group<TalkArgs, Return> {
    /** 1: Local, 2 or 10: global, 3 or 11: global + local */
    Scope: t_singleScope;
    /** Dependency members to be waited*/
    Members: i_waitSet<TalkArgs, Return>[];
    /** Callback function to be executed once all the dependencies become available*/
    Call: (value: any) => Promise<any>;
}

/**
 * Datatype for instructing monitor of a channel
 */
export interface i_subscription {
    /** 1: Local, 2 or 10: global, 3 or 11: global + local */
    Scope: t_scope;
    /** The namespace that is being subscribed to*/
    Namespace: t_namespace;
    /** Resolution that is being subscribed at */
    Listen: t_ri;
    /** Callback function to be executed when the subscription emits*/
    Call: (value: any) => any;
}

/**
 * Datatype for instructing monitor of a channel followed by a call whose 
 * return is emitted to the requester
 */
export interface i_service {
    /** 1: Local, 2 or 10: global, 3 or 11: global + local */
    Scope: t_scope;
    /** Namespace that is expected to respond to the request*/
    Namespace: t_namespace;
    /** Specific method that is being requested*/
    Listen: t_ri;
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
export interface i_reception {
    /** 1: Local, 2 or 10: global, 3 or 11: global + local */
    Scope: t_scope;
    /** Namespace that is accepting the admissions */
    Namespace?: t_namespace;
    /** Announcement resolution */
    Talk: t_resolutionInstruction;
    /** Listening resolution */
    Listen: t_ri;
    /** function that will be called when another node emits to the channel (namespace + . + method) */
    Call: (value: any) => any;
}

/**
 * Datatype for instructing emit of data to a certain channel without any 
 * following listening activity by the emitter
 */
export interface i_announcement {
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
export interface i_staticContentArchive {
    [channel: string]: {
        [unique_request_code: string]: i_response<any>,
    };
}

/**
 * Stores local controllers
 */
export interface i_localControllerStack {
    [namespace: string]: BaseController;
}




/**
 * Defines the properties necessary for executing one step
 */
export interface i_sequenceStep {
    /** Console mesage for the start of the step if enabled */
    StartMessage?: string;
    /** Console mesage for the end of the step if enabled */
    EndMessage?: string;
    /** Instruction to be listened to for determining the services' completion of the step */
    Listen: t_ri;
    /** List of namespaces that are required to complete the step */
    List: t_namespace[];
    /** Instruction to announce to listening services that the step execution is shall 
     * be carried out. Some steps may not require a talk as the execution starts through 
     * some other method */
    Talk?: t_ri;
}

/**
 * Generic mapping object for Controller
 */
export interface i_map<T> { [key: string]: T; }


/**
 * Sub set of t_transmission for talk event
 */
export interface i_talk<TalkArgs> {
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
    Talk: t_ri1<TalkArgs>;
    /** Error content if an error occured*/
    Error?: i_error;
    /** epoch when the transmission occured */
    Time: t_epoch;
    Static: boolean;
    Scope: e_Scope;
}

/**
 * Extends t_transmission for response event 
 */
export interface i_response<Content> {
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

    /** denotes the service group in service transmissions */
    Group: e_ServiceGroup;
    /** Talking that is involved with the transmission*/
    Talk: t_ri0;
    /** transmission content that is created by the responder */
    Content: Content;
    /** Error content if an error occured*/
    Error?: i_error;
    /** Unique request code*/
    Id: t_serviceId;
    /** epoch when the transmission occured */
    Time: t_epoch;
    Static: boolean;
    LastDynamicTime?: t_epoch;
    Scope: e_Scope;
}

export interface i_request {
    Channel: t_channel,
    Sender: t_namespace,
    Group: e_ServiceGroup,
    Recipient: t_namespace,
    Talk: t_ri0,
    Id: t_serviceId,
    Time: t_epoch,
    Static: boolean,
    Scope: e_Scope,
}

export interface i_announcementPacket<TalkArgs> {
    Channel: t_channel,
    Sender: t_namespace,
    Recipient: t_namespace,
    Talk: t_ri1<TalkArgs> | t_ri0,
    Time: t_epoch,
    Static: boolean,
    Scope: e_Scope,
}

/**
 * Interface for all event emitters that controller uses
 */
export interface i_EventEmitter {
    new(): this
    once(channel: t_channel, response: any): void
    on(channel: t_channel, packet: any): void
    emit(channel: t_channel, packet: any): void
    eventNames(): Array<any>;
    setMaxListeners(listener_count: number): this
}

/**
 * Dialogue archive item structure
 */
export interface i_dialogueArchiveItem {
    Meta: {
        Elapsed: t_epoch,
        State: "Fail" | "Success",
    },
    Request: i_request,
    Response: i_response<any>,
}

/**
 * Annoucement archive item structure
 */
export interface i_announcementArchiveItem {
    Namespace: t_namespace,
    Channel: t_channel,
    Content: any,
    Time: t_epoch,
}

/**
 * Alias for wait action callback
 */
export type t_waitActionCallback<TalkArgs, Return = i_talk<TalkArgs>> =
    (transmission: i_talk<TalkArgs>) => i_talk<TalkArgs> | Return;

/**
 * Alias for wait test callback
 */
export type t_waitTestCallback<TalkArgs> = (transmission: i_talk<TalkArgs>) => boolean

/**
 * Alias for wait promise resolve
 */
export type t_waitPromiseResponse<TalkArgs, Return> =
    (reason: t_wait<TalkArgs, Return> | Promise<t_wait<TalkArgs, Return>>) => t_wait<TalkArgs, Return>

export type t_wait<TalkArgs, Return> = i_talk<TalkArgs> | Return;