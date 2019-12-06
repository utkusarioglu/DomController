// Generated by dts-bundle v0.7.3
// Dependencies for this module:
//   ../@utkusarioglu/resolver
//   ../@utkusarioglu/namespace
//   ../@utkusarioglu/state
//   ../@utkusarioglu/state/t_state

declare module '@utkusarioglu/dom-controller' {
    export { Controller } from "@utkusarioglu/dom-controller/Controller/controller";
    export { M_Controller } from "@utkusarioglu/dom-controller/Mixins/m_controller";
    export { M_ControllerEvents } from "@utkusarioglu/dom-controller/Mixins/m_controller_events";
    export { C_Controller, C_StartupTalk, C_BootState, } from "@utkusarioglu/dom-controller/Common/c_controller";
    export { e_Scope, t_transmission, t_subscription, t_sequenceStep, t_dependency_group, t_service, t_reception, t_channel, t_waitSet, i_talk, i_Response } from "@utkusarioglu/dom-controller/Common/t_controller";
}

declare module '@utkusarioglu/dom-controller/Controller/controller' {
    import { t_ri0 } from "@utkusarioglu/resolver";
    import { SeparatorHandler } from "@utkusarioglu/dom-controller/Common/separator_handler";
    import { t_resolutionInstructionNoArgs } from "@utkusarioglu/resolver";
    import { t_scope, t_singleScope, t_waitSet, t_transmission, e_ServiceGroup, i_staticContentArchive, t_localControllerStack, t_epoch, i_talk, i_Request, i_Response } from "@utkusarioglu/dom-controller/Common/t_controller";
    import { t_namespace } from "@utkusarioglu/namespace";
    export class Controller extends SeparatorHandler {
        constructor(namespace: t_namespace);
        static flush_GlobalController(): void;
        request<T>(responding_namespace: t_namespace, talk: t_ri0, scope?: t_singleScope, group?: e_ServiceGroup): Promise<i_Response<T>>;
        respond(response_func: (transmission: i_Request) => Promise<any>, is_static?: boolean, scope?: t_scope, group?: e_ServiceGroup): void;
        get_DialogueArchive(scope: t_singleScope): object;
        static get_AllStaticChannels(): t_namespace[];
        static get_AllStaticContent(): i_staticContentArchive;
        static flush_StaticContentArchive(): void;
        static force_AllDynamicService(): void;
        announce(recipient_namespace: t_namespace, talk: t_ri0, scope?: t_scope, delay?: boolean | t_epoch): void;
        get_AnnouncementArchive(scope: t_singleScope): object[];
        subscribe(subcribed_namespace: t_namespace, listen: t_resolutionInstructionNoArgs, callback: (transmission: i_talk<any>) => void, scope?: t_scope): void;
        wait(recipient_namespace: t_namespace, listen: t_resolutionInstructionNoArgs, test_callback: ((transmission: t_transmission) => boolean) | undefined, action_callback: ((transmission: t_transmission) => void) | undefined, scope: t_singleScope, count?: number, current_count?: number): Promise<any>;
        wait_Some(wait_set: t_waitSet[], scope: t_singleScope): Promise<any>;
        set_LocalNamespace(local_namespace: t_namespace): this;
        get_LocalNamespace(): t_namespace;
        get_LocalNamespaces(): t_namespace[];
        set_GlobalNamespace(global_namespace: t_namespace): this;
        get_GlobalNamespace(): t_namespace;
        get_GlobalNamespaces(): t_namespace[];
        static get_LocalControllerStack(): t_localControllerStack;
    }
}

declare module '@utkusarioglu/dom-controller/Mixins/m_controller' {
    import { M_Namespace } from "@utkusarioglu/namespace";
    import { Controller } from "@utkusarioglu/dom-controller/Controller/controller";
    export interface M_Controller extends M_Namespace {
    }
    export abstract class M_Controller {
        protected set_Controller(): void;
        protected get_Controller(): Controller;
    }
}

declare module '@utkusarioglu/dom-controller/Mixins/m_controller_events' {
    import { M_State } from "@utkusarioglu/state";
    import { M_Namespace } from "@utkusarioglu/namespace";
    import { M_Controller } from "@utkusarioglu/dom-controller/Mixins/m_controller";
    import { t_subscription, t_reception, t_dependency_group, t_service, t_singleScope, t_sequenceStep } from "@utkusarioglu/dom-controller/Common/t_controller";
    import { t_resolutionInstruction } from "@utkusarioglu/resolver";
    import { t_namespace } from "@utkusarioglu/namespace";
    import { t_epoch } from "@utkusarioglu/state/t_state";
    export interface M_ControllerEvents extends M_Controller, M_State, M_Namespace {
    }
    export abstract class M_ControllerEvents {
        include_Subscriptions(subscription_list: Array<t_subscription>): this;
        include_Dependencies(dependencies_list: t_dependency_group[]): this;
        include_Receptions(reception_list: t_reception[]): this;
        include_Services(services_list: t_service[]): this;
        initialize_Controller(sequential_startup?: boolean): this;
        protected manage_ControllerSequence(sequence_steps: Array<t_sequenceStep>, scope: t_singleScope, manager_namespace: t_namespace): Promise<any>;
        produce_PromiseStackMember(scope: t_singleScope, manager_namespace: t_namespace, step: t_sequenceStep): Promise<any>;
        produce_StepsPromise(scope: t_singleScope, manager_namespace: t_namespace, step_promise_stack: Array<Promise<any>>, step: t_sequenceStep, index: number): Promise<any>;
        protected announce_ToAllServices(resolution_instruction: t_resolutionInstruction, delay?: t_epoch): void;
        protected announce_LibraryAdded(library_source_namespace: t_namespace): void;
    }
}

declare module '@utkusarioglu/dom-controller/Common/c_controller' {
    import { i_map } from "@utkusarioglu/dom-controller/Common/t_controller";
    import { t_resolutionInstructionNoArgs } from "@utkusarioglu/resolver";
    export const C_Controller: i_map<string>;
    export const C_BootState: i_map<t_resolutionInstructionNoArgs>;
    export const C_StartupTalk: i_map<t_resolutionInstructionNoArgs>;
}

declare module '@utkusarioglu/dom-controller/Common/t_controller' {
    import { BaseController } from "@utkusarioglu/dom-controller/BaseController/base_controller";
    import { t_resolutionInstructionNoArgs, t_resolutionInstruction, t_ri0 } from "@utkusarioglu/resolver";
    import { t_namespace } from "@utkusarioglu/namespace";
    export type t_epoch = number;
    export enum e_Scope {
        Local = 1,
        Global = 10,
        LocalAndGlobal = 11
    }
    export type t_scope = e_Scope;
    export type t_singleScope = e_Scope.Local | e_Scope.Global;
    export interface t_error {
    }
    export type t_channel = string;
    export type t_serviceId = string;
    export interface t_waitSet {
        Namespace: t_namespace;
        Listen: t_resolutionInstructionNoArgs;
        Test?: (transmission: t_transmission) => boolean;
        Call?: (transmission: t_transmission) => any;
    }
    export type t_transmissionContent = any;
    export interface t_transmission {
        Sender: t_namespace;
        Recipient: t_namespace;
        Channel: t_channel;
        Group?: e_ServiceGroup;
        Listen?: t_resolutionInstructionNoArgs;
        Talk?: t_resolutionInstruction;
        Content?: t_transmissionContent;
        Error?: t_error;
        Id?: t_serviceId;
        Time: t_epoch;
        Static: boolean;
        LastDynamicTime?: t_epoch;
        Scope: e_Scope;
    }
    export interface t_dependency_group {
        Scope: t_singleScope;
        Members: t_waitSet[];
        Call: (value: any) => Promise<any>;
    }
    export interface t_subscription {
        Scope: t_scope;
        Namespace: t_namespace;
        Listen: t_resolutionInstructionNoArgs;
        Call: (value: any) => any;
    }
    export interface t_service {
        Scope: t_scope;
        Namespace: t_namespace;
        Listen: t_resolutionInstructionNoArgs;
        Call: (value: any) => any;
        Static?: boolean;
        Group: e_ServiceGroup;
    }
    export interface t_reception {
        Scope: t_scope;
        Namespace?: t_namespace;
        Talk: t_resolutionInstruction;
        Listen: t_resolutionInstructionNoArgs;
        Call: (value: any) => any;
    }
    export interface t_announcement {
        Scope: t_scope;
        Namespace: t_namespace;
        Talk: any;
    }
    export enum e_ServiceGroup {
        Standard = 0
    }
    export interface i_staticContentArchive {
        [channel: string]: {
            [unique_request_code: string]: i_Response<any>;
        };
    }
    export interface t_localControllerStack {
        [namespace: string]: BaseController;
    }
    export interface t_sequenceStep {
        StartMessage?: string;
        EndMessage?: string;
        Listen: t_resolutionInstructionNoArgs;
        List: t_namespace[];
        Talk?: t_resolutionInstructionNoArgs;
    }
    export interface i_map<T> {
        [key: string]: T;
    }
    export interface i_talk<T> {
        Sender: t_namespace;
        Recipient: t_namespace;
        Channel: t_channel;
        Talk: T;
        Error?: t_error;
        Time: t_epoch;
        Static: boolean;
        Scope: e_Scope;
    }
    export interface i_Response<T> {
        Sender: t_namespace;
        Recipient: t_namespace;
        Channel: t_channel;
        Group: e_ServiceGroup;
        Talk: t_ri0;
        Content: T;
        Error?: t_error;
        Id: t_serviceId;
        Time: t_epoch;
        Static: boolean;
        LastDynamicTime?: t_epoch;
        Scope: e_Scope;
    }
    export interface i_Request {
        Channel: t_channel;
        Sender: t_namespace;
        Group: e_ServiceGroup;
        Recipient: t_namespace;
        Talk: t_ri0;
        Id: t_serviceId;
        Time: t_epoch;
        Static: boolean;
        Scope: e_Scope;
    }
}

declare module '@utkusarioglu/dom-controller/Common/separator_handler' {
    import { i_map } from "@utkusarioglu/dom-controller/Common/t_controller";
    export abstract class SeparatorHandler {
        protected static _SEPARATOR: i_map<string>;
        constructor();
        protected set_Separators_FromGlobal(): void;
        protected set_Separators(separators: i_map<string>): void;
        protected get_Separator(separator_name: string): string;
    }
}

declare module '@utkusarioglu/dom-controller/BaseController/base_controller' {
    import { SeparatorHandler } from "@utkusarioglu/dom-controller/Common/separator_handler";
    import { t_waitSet, t_transmission, e_ServiceGroup, e_Scope, t_singleScope, t_epoch, i_talk, i_Request } from "@utkusarioglu/dom-controller/Common/t_controller";
    import { t_resolutionInstruction, t_resolutionInstructionNoArgs } from "@utkusarioglu/resolver";
    import { t_namespace } from "@utkusarioglu/namespace";
    export class BaseController extends SeparatorHandler {
        constructor(controller_scope: t_singleScope);
        request(sender_namespace: t_namespace, recipient_namespace: t_namespace, talk: t_resolutionInstruction, scope: e_Scope, group: e_ServiceGroup): Promise<any>;
        respond(responder_namespace: t_namespace, response_callback: (transmission: i_Request) => Promise<any>, scope: e_Scope, group: e_ServiceGroup): void;
        get_DialogueArchive(): object[];
        publicget_ServedChannels(): string[];
        announce(sender_namespace: t_namespace, recipient_namespace: t_namespace, talk: t_resolutionInstruction, scope: t_singleScope, delay?: boolean | t_epoch): void;
        get_AnnouncementArchive(): object[];
        subscribe(subcribed_namespace: t_namespace, listen: t_resolutionInstructionNoArgs, callback: (transmission: i_talk<any>) => void, scope: t_singleScope): void;
        wait(waiter_namespace: t_namespace, recipient_namespace: t_namespace, listen: t_resolutionInstructionNoArgs, test_callback: ((transmission: t_transmission) => boolean) | undefined, action_callback: ((transmission: t_transmission) => any) | undefined, scope: t_singleScope, total_count?: number, current_count?: number): Promise<any>;
        wait_Some(scope: t_singleScope, waiter_namespace: t_namespace, wait_set: t_waitSet[]): Promise<t_transmission[]>;
    }
}

