
/* ////////////////////////////////////////////////////////////////////////////
 *
 *	IMPORTS
 *
 * ///////////////////////////////////////////////////////////////////////// */

/*
 *	DEPENDENCIES
 */
import { Resolution, t_ri0 } from "@utkusarioglu/resolver";

/*
 *	LOCAL CLASSES
 */
import { BaseController } from "../BaseController/base_controller";
import { SeparatorHandler } from "../Common/separator_handler";

/*
 *	CONSTANTS
 */
import { C_Controller } from "../Common/c_controller";

/*
 *	DATATYPES
 */
import {
    t_resolutionInstruction,
    t_resolutionInstructionNoArgs,
    t_instructionCode,
} from "@utkusarioglu/resolver";
import {
    t_scope,
    t_singleScope,
    t_waitSet,
    t_transmission,
    e_ServiceGroup,
    t_staticContentArchive,
    e_Scope,
    t_localControllerStack,
    t_channel,
    t_epoch,
    t_talk,
} from "../Common/t_controller";
import { i_map } from "@utkusarioglu/state/t_state"; // This should be removed
import { t_namespace } from "@utkusarioglu/namespace";



/* ////////////////////////////////////////////////////////////////////////////
 *
 *	EXPORTS
 *
 * ///////////////////////////////////////////////////////////////////////// */

/**
 * Establishes local and global event emitters,
 * Stores the history of exchanges
 *
 * @remarks
 * Service: Controller
 */
export class Controller extends SeparatorHandler {

/*
 * ======================================================= Boundary 1 =========
 *
 *	INSTANTIATION
 *
 * ============================================================================
 */

    /** 
     *  Provides BaseController functionality for global scope
     */
    private static _global_controller = new BaseController(e_Scope.Global);

    /** 
     *  Provides BaseContoller functionality for local scopes
     */
    private static _local_controllers: t_localControllerStack = {};

    /** 
     *  List of registered classes
     */
    private static _global_namespaces: t_namespace[] = [];

    /** 
     *  Global namespace for this controller instance
     */
    private _controller_global_namespace!: t_namespace;

    /** 
     *  Local namespace for this controller instance
     */
    private _controller_local_namespace!: t_namespace;

    /** 
     *  Holds the static content for every responder 
     */
    private static _static_content_archive: t_staticContentArchive = {};

    /** 
     *  Channels that respond statically 
     */
    private static _static_responders: t_namespace[] = [];

    /** 
     *  Boolean that states whether the static content archive 
     *  will be ignored 
     */
    private static _forced_dynamic_service: boolean = false;

    /**
     * Establishes local and global event emitters,
     * Stores the history of exchanges
     * 
     * @remarks
     * Class: Controller
     * Service: Controller
     */
    constructor(namespace: t_namespace) {
        super();

        this.set_GlobalNamespace(namespace);

        return this;
    }

    /**
     * Removes all the previously defined global controllers
     * 
     * @remarks
     * Class: Controller
     * Service: Controller
     */
    public static flush_GlobalController(): void {
        Controller._global_controller = new BaseController(e_Scope.Global);
        Controller.flush_GlobalNamespaces();
    }


/*
 * ======================================================= Boundary 1 =========
 *
 *	DIALOGUE
 *	
 *	Request and Respond functions together form the "service" feature.
 *	{@link A_Controller} class introduces include_Services method for 
 *	registering responses
 *
 * ============================================================================
 */

/* --------------------------------------------------------- Use Case ---------
 *	REQUEST
 */

    /**
     * Requests data from a certain channel, expects a .then response
     * If the responding channel is registered the group as static, static 
     * response will be served
     * 
     * @param scope defines local and/or global scope
     * @param responding_namespace t_namespace for the recipient
     * @param talk t_resolution that will be processed by the responding class
     *
     * @remarks
     * Class: Controller
     * Service: Controller
     */
    public request(
        scope: t_singleScope,
        responding_namespace: t_namespace,
        talk: t_resolutionInstruction,
        group: e_ServiceGroup = e_ServiceGroup.Standard,
    ): Promise<t_transmission> {

        const responding_channel =
            responding_namespace +
            this.get_Separator("Dialogue") + group;

        const instruction_code =
            Resolution.produce_UniqueInstructionCode(talk);

        if (Controller.is_StaticResponder(responding_channel) &&
            !Controller._forced_dynamic_service) {

            return Controller._static_content_archive.sniff(
                [
                    responding_channel,
                    instruction_code,
                ],
                () => {

                    const dynamic_transmission =
                        this.request_DynamicTransmission(
                            scope,
                            responding_namespace,
                            talk,
                            group,
                        );

                    Controller.set_PromisifiedStaticContent(
                        responding_channel,
                        instruction_code,
                        dynamic_transmission,
                    ); 

                    return dynamic_transmission;
                },
                (static_transmisson: t_transmission) => {

                    console.warn("Serving static content");

                    static_transmisson.Time = (new Date()).getTime();
                    return Promise.resolve(static_transmisson);
                },
            ); // sniff

        } else {

            return this.request_DynamicTransmission(
                scope,
                responding_namespace,
                talk,
                group,
            );

        } // if is_static_responder
    }

    /**
     * Requests dynamic transmission from related scopes
     * 
     * @param scope
     * @param recipient_namespace
     * @param talk
     * @param group
     *
     * @remarks
     * Class: Controller
     * Service: Controller
     */
    private request_DynamicTransmission(
        scope: t_singleScope,
        recipient_namespace: t_namespace,
        talk: t_resolutionInstruction,
        group: e_ServiceGroup = e_ServiceGroup.Standard,
    ): Promise<t_transmission> {
        return this
            .get_Scopes(scope)[0]
            .request(
                scope,
                this._controller_global_namespace,
                recipient_namespace,
                talk, group,
            );
    }



/* --------------------------------------------------------- Use Case ---------
 *	RESPOND
 */

    /**
     * Responds to controller requests
     * {@link A_Controller} class introduces include_Services method for 
     * registering responses
     * 
     * @param scope defines local and/or global scope
     * @param response_func (t_transmission) => Promise that will process the 
     * request
     * @param is_static: if true, the created response will be saved for the 
     * controller for 
     * speedy re-response in future requests, if false, the response callback 
     * will be called 
     * everytime the same request is made
     * @param group defines the set of methods that is available for the 
     * response. Used for responding to differing security clearances
     *
     * @remarks
     * Class: Controller
     * Service: Controller
     */
    public respond(
        scope: t_scope,
        response_func: (t_transmission: t_transmission) => Promise<any>,
        is_static: boolean = true,
        group: e_ServiceGroup = e_ServiceGroup.Standard,
    ): void {

        if (is_static) {
            Controller._static_responders.push(
                this._controller_global_namespace + 
                this.get_Separator("Dialogue") + 
                group,
            );
        }

        this.get_Scopes(scope).forEach((active_scope: BaseController) => {
            active_scope.respond(
                this._controller_global_namespace,
                response_func,
                group,
                scope,
            );
        });
    }



/* --------------------------------------------------------- Use Case ---------
 *	DOCUMENT and REPORT for DIALOGUE
 */ 

    /**
     * Returns the entire history of dialogues since the App run
     *
     * @remarks
     * Class: Controller
     * Service: Controller
     */
    public get_DialogueArchive(scope: t_singleScope): object {
        return this.get_Scopes(scope)[0].get_DialogueArchive();
    }

    /**
     * Returns all the channels that are being served
     *
     * @remarks
     * Class: Controller
     * Service: Controller
     */
    // public get_ServedChannels(scope: t_singleScope): (string | symbol)[] {
    //    return this.get_Scopes(scope)[0].get_ServedChannels();
    // }


/* --------------------------------------------------------- Use Case ---------
 *	HANDLE STATIC SERVICE
 */

    /**
     * Resolves the transmission promise, corrects the time of the transmission
     * Saves the content as static for the given channel and code
     * Warning: content served will remain to be dynamic until the promise 
     * is resolved
     * 
     * @param channel
     * @param instruction_code
     * @param static_content
     *
     * @remarks
     * Class: Controller
     * Service: Controller
     */
    private static set_PromisifiedStaticContent(
        channel: t_channel,
        instruction_code: t_instructionCode,
        static_content: Promise<t_transmission>,
    ): void {
        static_content
            .then((transmission: t_transmission) => {

                Controller._static_content_archive.pave(
                    [
                        channel,
                        instruction_code,
                    ],
                    () => {
                        console.warn(
                            C_Controller.E_MultipleRequestsBeforeResponse,
                        );
                    },
                    () => {

                        transmission.LastDynamicTime = transmission.Time;
                        transmission.Time = 0;
                        transmission.Static = true;

                        return transmission;
                    },
                );
            });
    }

    /**
     * Returns all channels that registered static service
     *
     * @remarks
     * Class: Controller
     * Service: Controller
     */
    public static get_AllStaticChannels(): t_namespace[] {
        return Controller._static_responders;
    }

    /**
     * Returns all the static content that is currently archived
     *
     * @remarks
     * Class: Controller
     * Service: Controller
     */
    public static get_AllStaticContent(): t_staticContentArchive {
        return Controller._static_content_archive;
    }

    /**
     * Clears the static content archive, forcing re-build
     *
     * @remarks
     * Class: Controller
     * Service: Controller
     */
    public static flush_StaticContentArchive(): void {
        Controller._static_content_archive = {};
    }

    /**
     * Forces all services to remain dynamic despit what the service 
     * provider intends
     *
     * @remarks
     * Class: Controller
     * Service: Controller
     */
    public static force_AllDynamicService(): void {
        console.log(C_Controller.E_ForcedDynamic);
        Controller._forced_dynamic_service = true;
    }



/*
 * ======================================================= Boundary 1 =========
 *
 *	MONOLOGUE
 *	
 *	These methods emit or listen to a certain channel but they do not expect 
 *	the other side to take any kind of action.
 *
 * ============================================================================
 */

/* --------------------------------------------------------- Use Case ---------
 *   TALK
 *   
 *   These emit locally or globally
 */

    /**
     * Declares to a channel and doesnt expect a response
     * 
     * @param scope specifies local and/or global scope
     * @param recipient_namespace the namespace that is the primary target for 
     * the announcement
     * @param talk the talk resolution for the announcement
     *
     * @remarks
     * Class: Controller
     * Service: Controller
     */
    public announce(
        scope: t_scope,
        recipient_namespace: t_namespace,
        talk: t_resolutionInstruction,
        delay: boolean | t_epoch = false,
    ): void {

        this.get_Scopes(scope).forEach((active_scope: BaseController) => {
            active_scope.announce(
                scope as t_singleScope,
                this._controller_global_namespace,
                recipient_namespace,
                talk,
                delay,
            );
        });
    }



/* --------------------------------------------------------- Use Case ---------
 *	DOCUMENT and REPORT for TALK
 */

    /**
     * Returns true if the specified channel is registered as a static 
     * responder
     * 
     * @param channel
     *
     * @remarks
     * Class: Controller
     * Service: Controller
     */
    private static is_StaticResponder(channel: t_channel): boolean {
        return this._static_responders.indexOf(channel) !== -1;
    }

    /**
     * Returns the entire list of announcements since app start
     */
    public get_AnnouncementArchive(scope: t_singleScope): object[] {
        return this.get_Scopes(scope)[0].get_AnnouncementArchive();
    }



/* --------------------------------------------------------- Use Case ---------
 *	LISTEN
 *	
 *	These listen globally or locally
 */

    /**
     * Listens during the run of the app, it may take internal action 
     * but the emitter talker will not be notified of this
     * 
     * @param scope specifies local and/or global scope
     * @param subcribed_namespace t_namespace that will be monitored
     * @param listen t_resolutionNoArgs that will be monitored
     * @param callback: (t_transmission) => void action to take when there 
     * is chatter
     *
     * @remarks
     * Class: Controller
     * Service: Controller
     */
    public subscribe(
        scope: t_scope,
        subcribed_namespace: t_namespace,
        listen: t_resolutionInstructionNoArgs,
        callback: (transmission: t_talk<any>) => void,
    ): void {

        this.get_Scopes(scope).forEach((active_scope: BaseController) => {
            active_scope.subscribe(
                scope as t_singleScope,
                subcribed_namespace,
                listen,
                callback);
        });
    }
     
    /**
     * 
     * Similar to subscribe, listens to a specific channel but does not 
     * respond to the source, Unlike subscribe, wait quits listening after 
     * a certain number of occurences of the channel, default = 1
     * 
     * @param scope Local or global
     * @oaram recipient_namespace t_namespace that will be monitored
     * @param listen t_resolutionNoArgs used for monitoring
     * @param test_callback callback for determining whether the channel 
     * signal meets the wait criteria
     * @param action_callback: callback to execute if the test callbak 
     * returns true
     * @param count number of times wait function will wait for the test 
     * callback to return true
     * @param current_count current iteration count of the wait
     *
     * @remarks
     * Class: Controller
     * Service: Controller
     */
    public wait(
        scope: t_singleScope,
        recipient_namespace: t_namespace,
        listen: t_resolutionInstructionNoArgs,
        test_callback: (transmission: t_transmission) => boolean = () => true,
        action_callback: (transmission: t_transmission) => void = () => { },
        count: number = 1,
        current_count: number = count,
    ): Promise<any> {
        const wait_response = this.get_Scopes(scope)[0].wait(
            scope,
            this._controller_global_namespace,
            recipient_namespace,
            listen,
            test_callback,
            action_callback,
            count,
            current_count,
        );

        return wait_response;
    }

    /**
     * Waits multiple conditions and returns promise when all of them are met
     * 
     * @param scope defines local and/or global scope
     * @param wait_set: instructions for the wait conditions
     *
     * @remarks
     * Class: Controller
     * Service: Controller
     */
    public wait_Some(
        scope: t_singleScope,
        wait_set: t_waitSet[],
    ): Promise<any> {
        return this
            .get_Scopes(scope)[0]
            .wait_Some(
                scope,
                this._controller_global_namespace,
                wait_set,
            );
    }



/*
 * ======================================================= Boundary 1 =========
 *
 *	HANDLE
 *	
 *	Getters, Setters, Checkers and Manipulators
 *
 * ============================================================================
 */

/* --------------------------------------------------------- Use Case ---------
 *	HANDLE NAMESPACE
 *	
 *	Methods involved with getting and setting global and local namespaces 
 *	for the instance
 */

    /**
     * Sets the namespace used for listening and emitting to local
     * 
     * @param local_namespace
     *
     * @remarks
     * Class: Controller
     * Service: Controller
     */
    public set_LocalNamespace(local_namespace: t_namespace): this {
        this._controller_local_namespace = local_namespace;
        this.create_LocalNamespace(local_namespace);
        return this;
    }

    /**
     * Returns the local namespace that the class emits and listens to
     */
    public get_LocalNamespace(): t_namespace {
        return this._controller_local_namespace;
    }

    /**
     * Gets the entire list of registered local namespaces
     *
     * @remarks
     * Class: Controller
     * Service: Controller
     */
    public get_LocalNamespaces(): t_namespace[] {
        return Object.keys(Controller._local_controllers);
        // return Controller._namespaces;
    }

    /**
     * Sets the global namespace for this instance
     * 
     * @param global_namespace as t_namespace
     *
     * @remarks
     * Class: Controller
     * Service: Controller
     */
    public set_GlobalNamespace(global_namespace: t_namespace): this {
        this._controller_global_namespace = global_namespace;
        this.add_Controller_ToGlobalNamespaces(global_namespace);
        return this;
    }

    /**
     * Returns the namespace that the class is registered as
     *
     * @remarks
     * Class: Controller
     * Service: Controller
     */
    public get_GlobalNamespace(): t_namespace {
        return this._controller_global_namespace;
    }


    /**
     * Creates a local namespace with the given name
     * 
     * @param local_namespace
     *
     * @remarks
     * Class: Controller
     * Service: Controller
     */
    private create_LocalNamespace(local_namespace: t_namespace): void {
        Controller._local_controllers
            .pave([local_namespace],
                () => {
                    // console.warn(`${local_namespace} already exists`)
                },
                () => {
                    return new BaseController(e_Scope.Local);
                },
            );
        // Controller._local_controllers[local_namespace] = 
    }

    /**
     * Deletes the local namespace
     * 
     * @param local_namespace
     *
     * @remarks
     * Class: Controller
     * Service: Controller
     */
    private destroy_LocalNamespace(local_namespace: t_namespace): void {
        delete Controller._local_controllers[local_namespace];
    }



/* --------------------------------------------------------- Use Case ---------
 *	HANDLE GLOBAL NAMESPACES
 */

    /**
     * 
     * @param controller_namespace
     */
    private add_Controller_ToGlobalNamespaces(
        global_namespace: t_namespace,
    ): void {
        Controller._global_namespaces.push(global_namespace);
    }

    /**
     * Returns all the controller registered global namespaces
     *
     * @remarks
     * Class: Controller
     * Service: Controller
     */
    public get_GlobalNamespaces(): t_namespace[] {
        return Controller._global_namespaces;
    }

    /**
     * Clears the list of previously defined global namespaces
     *
     * @remarks
     * Class: Controller
     * Service: Controller
     */
    private static flush_GlobalNamespaces(): void {
        Controller._global_namespaces = [];
    }


/* --------------------------------------------------------- Use Case ---------
 *	HANDLE SCOPE
 */

    /**
     * Returns an array of Basecontrollers for the given scope value
     * 
     * @param scope: number that defines the scopes 
     *
     * @remarks
     * Class: Controller
     * Service: Controller
     */
    private get_Scopes(scope: t_scope | t_singleScope): BaseController[] {

        const list: BaseController[] = [];

        if (scope & 1) {
            if (this._controller_local_namespace) {
                list.push(
                    Controller
                        ._local_controllers[this._controller_local_namespace],
                );
            }
        }

        if (scope & 2) {
            list.push(Controller._global_controller);
        }

        if (list.length < 1) {
            throw new Error(C_Controller.E_NoScopeSelected);
        }

        return list;
    }

    /**
     * Returns all currently defined local controllers
     *
     * @remarks
     * Class: Controller
     * Service: Controller
     */
    public static get_LocalControllerStack(): t_localControllerStack {
        return Controller._local_controllers;
    }
}



