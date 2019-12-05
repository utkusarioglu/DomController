import { BaseController } from "../BaseController/base_controller";
import { t_resolutionInstructionNoArgs, t_resolutionInstruction, t_ri0 } from "@utkusarioglu/resolver";
import { t_namespace } from "@utkusarioglu/namespace";
export declare type t_epoch = number;
export declare enum e_Scope {
    Local = 1,
    Global = 10,
    LocalAndGlobal = 11
}
export declare type t_scope = e_Scope;
export declare type t_singleScope = e_Scope.Local | e_Scope.Global;
export interface t_error {
}
export declare type t_channel = string;
export declare type t_serviceId = string;
export interface t_waitSet {
    Namespace: t_namespace;
    Listen: t_resolutionInstructionNoArgs;
    Test?: (transmission: i_Response) => boolean;
    Call?: (transmission: i_Response) => any;
}
export declare type t_transmissionContent = any;
export interface i_Response {
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
export declare enum e_ServiceGroup {
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
