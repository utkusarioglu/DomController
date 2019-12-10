
/* ////////////////////////////////////////////////////////////////////////////
 *
 *	IMPORTS
 *
 * ///////////////////////////////////////////////////////////////////////// */

/*
 *	DEPENDENCIES
 */
import { M_State } from "@utkusarioglu/state";
import { M_Namespace } from "@utkusarioglu/namespace";

/*
 *	LOCALS
 */
import { M_Controller } from "./m_controller";

/*
 *	CONSTANTS
 */
import {
    C_Controller,
    C_BootState,
    C_StartupTalk,
} from "../Common/c_controller";

/*
 *	DATA TYPES
 */
import {
    i_subscription,
    i_reception,
    i_dependency_group,
    i_service,
    i_announcement,
    e_Scope,
    e_ServiceGroup,
    t_singleScope,
    i_sequenceStep,
} from "../Common/t_controller";
import {
    t_ri,
    t_ri0,
} from "@utkusarioglu/resolver";
import { t_namespace } from "@utkusarioglu/namespace";
import { t_epoch } from "@utkusarioglu/state/t_state";



/* ////////////////////////////////////////////////////////////////////////////
 *
 *	EXPORTS
 *
 * ///////////////////////////////////////////////////////////////////////// */

/**
 * Provides autocorrect for the class
 * 
 * @requires M_Controller
 *
 * @remarks
 * Class: M_ControllerEvents
 * Service: Controller
 */
export interface M_ControllerEvents extends
    M_Controller,
    M_State,
    M_Namespace { }



/**
 * Introduces methods for registering subscriptions, dependencies, 
 * announcements, and services for the extending class Handles the order of 
 * operations for the controller  to run smoothly
 * The associated controller needs to be run by the child class 
 * Global (and if needed, Local) namespaces need to be set before the 
 * initializer is run Needs @link State function to be defined in the 
 * parent to determine the local namespace
 * 
 * @remarks
 * Service: Controller
 */
export abstract class M_ControllerEvents {

/*
 *	LOGS
 */
    private _subscriptions!: Array<i_subscription>;
    private _announcements!: Array<i_announcement>;
    private _receptions!: Array<i_reception>; // this isn't emitted, it's only for archiving
    private _dependencies!: Array<i_dependency_group<any, any>>;
    private _services!: Array<i_service>;


/*
 * ======================================================= Boundary 1 =========
 *
 *	DECLARATION
 *	
 *	Declaration of controls by the instantiating class
 *
 * ============================================================================
 */

/* --------------------------------------------------------- Use Case ---------
 *	INCLUDE CONTROLS
 */

    /**
     * Includes the given array items among the subscriptions for the set local 
     * or global namespace
     * 
     * @param subscription_list
     *
     * @remarks
     * Class: M_ControllerEvents
     * Service: Controller
     */
    public include_Subscriptions(
        subscription_list: Array<i_subscription>,
    ): this {

        if (!this._subscriptions) {
            this._subscriptions = [];
        }

        this._subscriptions.push(...subscription_list);
        return this;
    }

    /**
     * Includes the given array items among the dependencies for the set local 
     * or global namespace
     * 
     * @param dependencies_list
     *
     * @remarks
     * Class: M_ControllerEvents
     * Service: Controller
     */
    public include_Dependencies<TalkArgs, Return>(
        dependencies_list: i_dependency_group<TalkArgs, Return>[],
    ): this {

        if (!this._dependencies) {
            this._dependencies = [];
        }

        this._dependencies.push(...dependencies_list);
        return this;
    }

    /**
     * Includes the given array items among announcement and subscriptions.
     * Unlike other methos, this registers 2 different events
     * 
     * @param reception_list
     *
     * @remarks
     * Class: M_ControllerEvents
     * Service: Controller
     */
    public include_Receptions(reception_list: i_reception[]): this {

        if (!this._receptions) {
            this._receptions = [];
        }

        if (!this._subscriptions) {
            this._subscriptions = [];
        }

        if (!this._announcements) {
            this._announcements = [];
        }

        this._receptions.push(...reception_list);

        reception_list.forEach((reception: i_reception) => {

            this._subscriptions.push({
                Scope: reception.Scope,
                Namespace: reception.Namespace || this.get_GlobalNamespace(),
                Listen: reception.Listen,
                Call: reception.Call,
            } as i_subscription);

            this._announcements.push({
                Scope: reception.Scope,
                Namespace: reception.Namespace,
                Talk: reception.Talk,
            } as i_announcement);
        });

        return this;
    }

    /**
     * Includes the given array items among the services for the set local or 
     * global namespace
     * 
     * @param services_list
     *
     * @remarks
     * Class: M_ControllerEvents
     * Service: Controller
     */
    public include_Services(services_list: i_service[]): this {

        if (!this._services) {
            this._services = [];
        }

        this._services.push(...services_list);
        return this;
    }


/*
 * ======================================================= Boundary 1 =========
 *
 *	IMPLEMENTATION
 *	
 *	Registration of controls
 *	Announcement of startup states
 *
 * ============================================================================
 */

/* --------------------------------------------------------- Use Case ---------
 *	INITIALIZE CONTROLS
 */

    /**
     * Runs listen and talk operations in the order and times that they are 
     * supposed to be run
     *
     * @remarks
     * Class: M_ControllerEvents
     * Service: Controller
     */
    public initialize_Controller(sequential_startup: boolean = true): this {

        this.set_Controller();

        if (sequential_startup) {

            // Listens
            this.get_Controller()
                .wait(
                    C_Controller.AllServices,
                    C_StartupTalk.run_Listen,
                    undefined,
                    () => {

                        this.register_Dependencies();
                        this.register_Subscriptions();

                        this.announce_ToAllServices(C_BootState.ListenReady);
                    },
                    e_Scope.Global,
                );

            // Talks
            this.get_Controller()
                .wait(
                    C_Controller.AllServices,
                    C_StartupTalk.run_Talk,
                    undefined,
                    () => {

                        this.register_Announcements();
                        this.register_Services();

                        this.announce_ToAllServices(C_BootState.TalkReady);
                    },
                    e_Scope.Global,
                );

            this.announce_ToAllServices(C_BootState.ClassReady, 200)

        } else {

            this.register_Dependencies();
            this.register_Subscriptions();
            this.register_Announcements();
            this.register_Services();
            this.announce_ToAllServices(C_BootState.ClassReady, 200)

        }


        return this;
    }



/* --------------------------------------------------------- Use Case ---------
 *	REGISTER CONTROLS
 *	
 *  These are used by the method {@link initialize_Controller} to register 
 *  included controls
 */

    /**
     * Excetutes controller for the subscriptions that were registered by the
     * include method
     *
     * @remarks
     * Class: M_ControllerEvents
     * Service: Controller
     */
    private register_Subscriptions(): void {
        if (this._subscriptions) {
            this._subscriptions.forEach((subscription: i_subscription) => {
                this.get_Controller().subscribe(
                    subscription.Listen,
                    subscription.Call,
                    subscription.Namespace,
                    subscription.Scope,
                );
            });
        }
    }

    /**
     * Excetutes controller for the dependencies that were registered by the 
     * include method
     *
     * @remarks
     * Class: M_ControllerEvents
     * Service: Controller
     */
    private register_Dependencies(): void {
        if (this._dependencies && this._dependencies.length > 0) {
            this._dependencies
                .forEach((dependency: i_dependency_group<any, any>) => {
                    this.get_Controller().wait_Some(
                        dependency.Members,
                        dependency.Scope,
                    )
                        .then((data) => {
                            return dependency.Call(data);
                        })
                        .then(
                            this.announce_ToAllServices.bind(
                                this,
                                C_BootState.DependencyReady,
                            ),
                        );
            });
        } else {
            this.announce_ToAllServices(C_BootState.DependencyReady);
        }
    }

    /**
     * Excetutes controller for the announcements that were registered by the
     * include method
     *
     * @remarks
     * Class: M_ControllerEvents
     * Service: Controller
     */
    private register_Announcements(): void {
        if (this._announcements) {
            this._announcements.forEach((announcement: i_announcement) => {
                this.get_Controller().announce(
                    announcement.Namespace,
                    announcement.Talk,
                    announcement.Scope,
                );
            });
        }
    }

    /**
     * Excetutes controller for the services that were registered by the 
     * include method
     *
     * @remarks
     * Class: M_ControllerEvents
     * Service: Controller
     */
    private register_Services(): void {
        if (this._services) {
            this._services.forEach((service: i_service) => {
                this.get_Controller().respond(
                    service.Call,
                    service.Static || false,
                    service.Scope,
                    e_ServiceGroup.Standard,
                );
            }); 
        }
    }



/* --------------------------------------------------------- Use Case ---------
 *	MANAGE CONTROLLER SEQUENCES
 */

    /**
     * Executes the provided Controller talks and listens in sequence
     * 
     * @param sequence_steps
     * @param scope
     * @param manager_namespace
     *
     * @remarks
     * Class: M_ControllerEvents
     * Service: Controller
     */
    protected manage_ControllerSequence(
        sequence_steps: Array<i_sequenceStep>,
        scope: t_singleScope,
        manager_namespace: t_namespace,
    ): Promise<any> {

        let TEST;
        //return Promise.resolve(this.get_GlobalNamespace());

        const step_promise_stack:
            Array<Promise<t_ri>> = [];

        let steps_promise_sequence: Promise<void> = Promise.resolve();

        sequence_steps.forEach((step, index) => {

            step_promise_stack[index] =
                this.produce_PromiseStackMember(
                    scope,
                    manager_namespace,
                    step
                );

            steps_promise_sequence = steps_promise_sequence
                .then(() => {
                    return this.produce_StepsPromise(
                        scope,
                        manager_namespace,
                        step_promise_stack,
                        step,
                        index,
                    );

                }); // steps_promise_sequence.then

        }); // sequence_steps.forEach

        //return Promise.resolve(sequence_steps[0].List);

        return steps_promise_sequence;

    }

    /**
     * 
     * 
     * @param scope
     * @param manager_namespace
     * @param step
     */
    produce_PromiseStackMember(
        scope: t_singleScope,
        manager_namespace: t_namespace,
        step: i_sequenceStep,
    ): Promise<t_ri> {
        return new Promise((resolve_step_promise) => {
            return this.get_Controller().wait<string, any>(
                manager_namespace,
                step.Listen,
                (transmission) => {

                    step.List = step.List.filter((value: string) => {
                        return value !== transmission.Sender;
                    });

                    return step.List.length < 1;

                },
                () => {
                    return resolve_step_promise(step.Listen);
                },
                scope,
            ); // return this.get_Controller().wait

        }); // step_promise_stack[index]
    }

    /**
     * 
     * 
     * @param scope
     * @param manager_namespace
     * @param step_promise_stack
     * @param step
     * @param index
     */
    produce_StepsPromise(
        scope: t_singleScope,
        manager_namespace: t_namespace,
        step_promise_stack: Array<Promise<any>>,
        step: i_sequenceStep,
        index: number,
    ): Promise<any> {

        step.sniff(["StartMessage"], undefined,
            (start_message: string) => {
                console.log(start_message);
            });

        step.sniff(["Talk"], undefined,
            (step_talk: t_ri) => {
                this.get_Controller().announce(
                    manager_namespace,
                    step_talk,
                    scope,
                );
            });

        const index_str: string = index.toString();

        return step_promise_stack.sniff([index_str],
            () => {
                throw new Error(
                    C_Controller.E_ActiveStepMemberCount
                        .subs(index_str)
                );
            },
            () => {
                const active_step_promise_stack =
                    step_promise_stack.slice(0, index + 1);

                return Promise.all(active_step_promise_stack);
            });
    }


/* --------------------------------------------------------- Use Case ---------
 *	ANNOUNCE STATES 
 */

    /**
     * Standardized method for announcing to all services
     * 
     * @param resolution_instruction
     *
     * @remarks
     * Class: M_ControllerEvents
     * Service: Controller
     */
    protected announce_ToAllServices(
        resolution_instruction: t_ri,
        delay: t_epoch = 0,
    ): void {

        this.get_Controller().announce(
            C_Controller.AllServices,
            resolution_instruction,
            e_Scope.Global,
            delay,
        );
    }

    /**
     * Standardized method for library adding
     * 
     * @param library_source_namespace
     *
     * @remarks
     * Class: M_ControllerEvents
     * Service: Controller
     */
    protected announce_LibraryAdded(
        library_source_namespace: t_namespace,
    ): void {
        this.get_Controller().announce<t_namespace>(
            C_Controller.AllServices,
            [...C_BootState.LibraryAdded, [library_source_namespace]] as t_ri<[t_namespace]>,
            e_Scope.Global,
            true,
        );
    }

}
