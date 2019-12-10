import { BaseController } from "../BaseController/base_controller";
import { t_ri } from "@utkusarioglu/resolver";
import { t_namespace } from "@utkusarioglu/namespace";
import { t_ri_any } from "@utkusarioglu/resolver/Common/t_resolver";
export declare type t_epoch = number;
export declare enum e_Scope {
    Local = 1,
    Global = 10,
    LocalAndGlobal = 11
}
export declare type t_scope = e_Scope;
export declare type t_singleScope = e_Scope.Local | e_Scope.Global;
export interface i_error {
}
export declare type t_channel = string;
export declare type t_serviceId = string;
export interface i_waitSet<TalkArgs, Return> {
    Namespace: t_namespace;
    Listen: t_ri;
    Test?: t_waitTestCallback<TalkArgs>;
    Call?: t_waitPromiseResponse<TalkArgs, Return>;
}
export declare type t_transmissionContent = any;
export interface i_dependency_group<TalkArgs, Return> {
    Scope: t_singleScope;
    Members: i_waitSet<TalkArgs, Return>[];
    Call: (value: any) => Promise<any>;
}
export interface i_subscription {
    Scope: t_scope;
    Namespace: t_namespace;
    Listen: t_ri;
    Call: (value: any) => any;
}
export interface i_service {
    Scope: t_scope;
    Namespace: t_namespace;
    Listen: t_ri;
    Call: (value: any) => any;
    Static?: boolean;
    Group: e_ServiceGroup;
}
export interface i_reception {
    Scope: t_scope;
    Namespace?: t_namespace;
    Talk: t_ri;
    Listen: t_ri;
    Call: (value: any) => any;
}
export interface i_announcement {
    Scope: t_scope;
    Namespace: t_namespace;
    Talk: any;
}
export declare enum e_ServiceGroup {
    Standard = 0
}
export interface i_staticContentArchive {
    [channel: string]: {
        [unique_request_code: string]: i_response<any>;
    };
}
export interface i_localControllerStack {
    [namespace: string]: BaseController;
}
export interface i_sequenceStep {
    StartMessage?: string;
    EndMessage?: string;
    Listen: t_ri;
    List: t_namespace[];
    Talk?: t_ri;
}
export interface i_map<T> {
    [key: string]: T;
}
interface i_transmission {
    Sender: t_namespace;
    Recipient: t_namespace;
    Channel: t_channel;
    Error?: i_error;
    Time: t_epoch;
    Scope: e_Scope;
}
export interface i_talk<TalkRi> extends i_transmission {
    Talk: TalkRi;
}
export interface i_response<Content> extends i_transmission {
    Group: e_ServiceGroup;
    Talk: t_ri_any;
    Content: Content;
    Id: t_serviceId;
    Static: boolean;
    LastDynamicTime?: t_epoch;
}
export interface i_request extends i_transmission {
    Group: e_ServiceGroup;
    Talk: t_ri_any;
    Id: t_serviceId;
    Static: boolean;
}
export interface i_announcementPacket<TalkRi> {
    Channel: t_channel;
    Sender: t_namespace;
    Recipient: t_namespace;
    Talk: TalkRi;
    Time: t_epoch;
    Static: boolean;
    Scope: e_Scope;
}
export interface i_EventEmitter {
    new (): this;
    once(channel: t_channel, response: any): void;
    on(channel: t_channel, packet: any): void;
    emit(channel: t_channel, packet: any): void;
    eventNames(): Array<any>;
    setMaxListeners(listener_count: number): this;
}
export interface i_dialogueArchiveItem {
    Meta: {
        Elapsed: t_epoch;
        State: "Fail" | "Success";
    };
    Request: i_request;
    Response: i_response<any>;
}
export interface i_announcementArchiveItem {
    Namespace: t_namespace;
    Channel: t_channel;
    Content: any;
    Time: t_epoch;
}
export declare type t_waitActionCallback<TalkArgs, Return = i_talk<TalkArgs>> = (transmission: i_talk<TalkArgs>) => i_talk<TalkArgs> | Return;
export declare type t_waitTestCallback<TalkArgs> = (transmission: i_talk<TalkArgs>) => boolean;
export declare type t_waitPromiseResponse<TalkArgs, Return> = (reason: t_wait<TalkArgs, Return> | Promise<t_wait<TalkArgs, Return>>) => t_wait<TalkArgs, Return>;
export declare type t_wait<TalkArgs, Return> = i_talk<TalkArgs> | Return;
export {};
