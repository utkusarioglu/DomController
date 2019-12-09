import { M_State } from "@utkusarioglu/state";
import { M_Namespace } from "@utkusarioglu/namespace";
import { M_Controller } from "./m_controller";
import { i_subscription, i_reception, i_dependency_group, i_service, t_singleScope, i_sequenceStep } from "../Common/t_controller";
import { t_ri } from "@utkusarioglu/resolver";
import { t_namespace } from "@utkusarioglu/namespace";
import { t_epoch } from "@utkusarioglu/state/t_state";
export interface M_ControllerEvents extends M_Controller, M_State, M_Namespace {
}
export declare abstract class M_ControllerEvents {
    private _subscriptions;
    private _announcements;
    private _receptions;
    private _dependencies;
    private _services;
    include_Subscriptions(subscription_list: Array<i_subscription>): this;
    include_Dependencies<TalkArgs, Return>(dependencies_list: i_dependency_group<TalkArgs, Return>[]): this;
    include_Receptions(reception_list: i_reception[]): this;
    include_Services(services_list: i_service[]): this;
    initialize_Controller(sequential_startup?: boolean): this;
    private register_Subscriptions;
    private register_Dependencies;
    private register_Announcements;
    private register_Services;
    protected manage_ControllerSequence(sequence_steps: Array<i_sequenceStep>, scope: t_singleScope, manager_namespace: t_namespace): Promise<any>;
    produce_PromiseStackMember(scope: t_singleScope, manager_namespace: t_namespace, step: i_sequenceStep): Promise<t_ri>;
    produce_StepsPromise(scope: t_singleScope, manager_namespace: t_namespace, step_promise_stack: Array<Promise<any>>, step: i_sequenceStep, index: number): Promise<any>;
    protected announce_ToAllServices(resolution_instruction: t_ri, delay?: t_epoch): void;
    protected announce_LibraryAdded(library_source_namespace: t_namespace): void;
}
