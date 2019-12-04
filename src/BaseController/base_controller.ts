
/*
 *	COMMON CLASSES
 */ 
import { EventEmitter } from "@utkusarioglu/event-emitter";
import { Resolution, t_ri0 } from "@utkusarioglu/resolver";
import { SeparatorHandler } from "../Common/separator_handler";
/*
 *	CONSTANTS
 */
import { C_Controller } from "../Common/c_controller";

/*
 *	DATATYPES
 */
import {
    t_serviceId,
    t_waitSet,
    t_transmission,
    e_ServiceGroup,
    e_Scope,
    t_singleScope,
    t_channel,
    t_epoch,
    t_talk,
} from "../Common/t_controller";
import {
    t_resolutionInstruction,
    t_resolutionInstructionNoArgs,
    t_expressionTrail,
} from "@utkusarioglu/resolver";
import { t_namespace } from "@utkusarioglu/namespace";



/**
 * Extends event emitter to include specific send and receive functions for 
 * a single scope. Controller class introduces local and global scopes using 
 * this class
 * 
 * @remarks
 * Service: Controller
 */
export class BaseController extends SeparatorHandler {

/*
 * ======================================================= Boundary 1 =========
 *
 *	DECLARATION
 *
 * ============================================================================
 */

    /** 
     *  Event emitter for talk and listen use cases
     */
    private _monologue_emitter = new EventEmitter().setMaxListeners(20); // this increase may have some speed cost

    /**
     *  Event emitter for services
     */
    private _dialogue_emitter = new EventEmitter().setMaxListeners(20); // this increase may have some speed cost;

    /**
     *  Stores runtime announcements
     */
    private _announcement_archive: object[] = [];

    /**
     *  Stores runtime requests and responds
     */
    private _dialogue_archive: object[] = [];

    /**
     * Scope that the basecontroller is currently working on
     */
    private _controller_scope: t_singleScope; // BaseController doesn't use this, but it's useful for debuging

/*
 *	These will be used in future feature expansions
 */
    // private static _static_reserve = {};
    // private _open_requests: object[] = [];
    // private _open_annuncements: object[] = [];
    // private _open_subscriptions: object[] = [];
    // private _open_waits: object[] = [];
    // private _open_wait_dependencies: object[] = [];

    /**
     * Extends event emitter to include specific send and receive functions 
     * for a single scope. Controller class introduces local and global scopes 
     * using this class
     * 
     * @param controller_scope
     * 
     * @remarks
     * Class: Basecontroller
     * Service: Controller
     */
    constructor(controller_scope: t_singleScope) {
        super();
        this._controller_scope = controller_scope;
    }



/*
 * ======================================================= Boundary 1 =========
 *
 *	DIALOGUE
 *	
 *	2 way data transfer between nodes
 *
 * ============================================================================
 */

/* --------------------------------------------------------- Use Case ---------
 *	REQUEST
 */

    /**
     * Requests data from the given channel
     * 
     * @remarks 
     * this method is a part of the Controller subsystem.
     * Works in tandem with  {@link BaseController.(serve:instance)}
     * 
     * 
     * @param sender_namespace namespace of the requesting class
     * @param recipient_namespace namespace that is intended to receive the 
     * request
     * @param talk the resolution that the responder will process
     * @param group defines the set of methods that will be used for the service
     * 
     * @returns Requested data inside the transmission wrapper object as 
     * Promise<t_transmission>
     *
     * @remarks
     * Class: Basecontroller
     * Service: Controller
     */
    public request(
        scope: e_Scope,
        sender_namespace: t_namespace,
        recipient_namespace: t_namespace,
        talk: t_resolutionInstruction,
        group: e_ServiceGroup,
    ): Promise<any> {

        const service_id: t_serviceId = BaseController.create_RandomServiceId();
        const request_channel: t_channel = recipient_namespace +
            this.get_Separator("Dialogue") +
            group;
        const response_channel: t_channel = request_channel +
            this.get_Separator("Id") +
            service_id;
        const request_packet: t_transmission = {
            Channel: response_channel,
            Sender: sender_namespace,
            Recipient: recipient_namespace,
            Talk: talk,
            Id: service_id,
            Time: (new Date()).getTime(),
            Static: false,
            Scope: scope,
        };

        return new Promise((resolve, reject) => {

            this._dialogue_emitter
                .once((response_channel), (response_packet: t_transmission) => {

                response_packet.sniff("Error",
                    resolve.bind(null, response_packet),
                    reject.bind(null, response_packet),
                );

                this.archive_Dialogue(request_packet, response_packet);
            });

            this._dialogue_emitter.emit(
                request_channel,
                request_packet as t_transmission,
            );
        });
    }

    



/* --------------------------------------------------------- Use Case ---------
 *	RESPOND
 */

    /**
     * Responds to controller requests
     * {@link A_Controller} class introduces include_Services method for 
     * registering responses
     *
     * @param responder_namespace
     * @param listen the resolution that the respond method will be 
     * listening to
     * @param requester_namespace the namespace that is intended to receive 
     * the message
     * @param response the callback function that will create the response 
     * for the request
     * @param is_static if true, the created response will be saved for the 
     * controller for
     * speedy re-response in future requests, if false, the response callback 
     * will be called
     * everytime the same request is made
     *
     * @remarks
     * Class: Basecontroller
     * Service: Controller
     */
    public respond(
        responder_namespace: t_namespace,
        response_callback: (transmission: t_transmission) => Promise<any>,
        group: e_ServiceGroup,
        scope: e_Scope,
    ): void {

        const listen_channel: t_channel =
            responder_namespace +
            this.get_Separator("Dialogue") +
            group;

        this._dialogue_emitter.on(listen_channel,
            (transmission: t_transmission) => {

                response_callback(transmission)
                    .then((requested_return_content: any) => { 

                        const serve_packet: t_transmission = {
                            Sender: transmission.Recipient,
                            Recipient: transmission.Sender,
                            Talk: transmission.Talk,
                            Channel: transmission.Channel,
                            Content: requested_return_content,
                            Time: (new Date()).getTime(),
                            Static: false,
                            Scope: scope,
                        };

                        this._dialogue_emitter
                            .emit(
                                transmission.Channel as t_channel,
                                serve_packet,
                            );

                    }) // then
                    .catch((error) => {
                        console.log("serve error:", error);
                    });

            }); // dialogue emitter
    }


/* --------------------------------------------------------- Use Case ---------
 *   DOCUMENT and REPORT for DIALOGUE
 */

    /**
     * Archives the given dialogue data
     * 
     * @param request_packet
     * @param response_packet
     *
     * @remarks
     * Class: Basecontroller
     * Service: Controller
     */
    private archive_Dialogue(
        request_packet: t_transmission,
        response_packet: t_transmission,
    ): void {

        this._dialogue_archive.push({
            Meta: {
                Elapsed: (new Date()).getTime() - request_packet.Time,
                State: response_packet.hasOwnProperty("Error")
                    ? "Fail"
                    : "Success",
            },
            Request: request_packet,
            Response: response_packet,
        });
    }

    /**
     * Creates a random service Id for the service channel to be unique
     *
     * @remarks
     * Class: Basecontroller
     * Service: Controller
     */
    private static create_RandomServiceId(): t_serviceId {
        return Math.random().toString().slice(2);
    }

    /**
     * Returns the entire history of dialogues since the App run
     *
     * @remarks
     * Class: Basecontroller
     * Service: Controller
     */
    public get_DialogueArchive() {
        return this._dialogue_archive;
    }
    

    /**
     * Returns all the channels that are being served
     *
     * @remarks
     * Class: Basecontroller
     * Service: Controller
     */
    public publicget_ServedChannels() {
        return this._dialogue_emitter.eventNames();
    }



/*
 * ======================================================= Boundary 1 =========
 *
 *	MONOLOGUE
 *	
 *	Transmission during which the emitter or listener do not acknowledge 
 *	each other
 *
 * ============================================================================
 */

/* --------------------------------------------------------- Use Case ---------
 *	TALK
 */

    /**
     * Declares to a channel and doesnt expect a response
     * 
     * @param sender_namespace namespace of the class that is making the 
     * announcement
     * @param recipient_namespace namespace that is the main subject of the 
     * announcement
     * @param talk the content us being transmitted
     * @param scope Scope of the message. Scope does not have any part in 
     * emittance, 
     * it's required for archiving
     *
     * @remarks
     * Class: Basecontroller
     * Service: Controller
     */
    public announce(
        scope: t_singleScope,
        sender_namespace: t_namespace,
        recipient_namespace: t_namespace,
        talk: t_resolutionInstruction,
        delay: boolean | t_epoch = false,
    ): void {

        const expression_trail: t_expressionTrail =
            Resolution.extract_ExpressionTrail(talk);

        const announcement_channel: string = recipient_namespace +
            this.get_Separator("Monologue") +
            expression_trail;

        const announcement_packet: t_transmission = {
            Channel: announcement_channel,
            Sender: sender_namespace,
            Recipient: recipient_namespace,
            Talk: talk,
            Time: (new Date()).getTime(),
            Static: false,
            Scope: scope,
        };

        const do_announcement = () => {

            this._monologue_emitter.emit(
                announcement_channel,
                announcement_packet,
            );

            this.archive_Announcement(
                sender_namespace,
                announcement_channel,
                announcement_packet,
            );
        };

        if (delay) {

            if (delay === true) {
                delay = C_Controller.GraceTime as unknown as t_epoch;
            }

            setTimeout(do_announcement, delay as t_epoch);

        } else {
            do_announcement();
        }
    }



/* --------------------------------------------------------- Use Case ---------
 *   DOCUMENT and REPORT for TALK
 */

    /**
     * Returns entire announcement archive since the start of the app
     *
     * @remarks
     * Class: Basecontroller
     * Service: Controller
     */
    public get_AnnouncementArchive(): object[] {
        return this._announcement_archive;
    }

    /**
     * Archives the given announcement data
     * 
     * @param sender_namespace
     * @param announcement_channel
     * @param announcement_packet
     *
     * @remarks
     * Class: Basecontroller
     * Service: Controller
     */
    private archive_Announcement(
        sender_namespace: t_namespace,
        announcement_channel: t_channel,
        announcement_packet: any = null,
    ): void {

        this._announcement_archive.push({
            Namespace: sender_namespace,
            Channel: announcement_channel,
            Content: announcement_packet,
            Time: (new Date()).getTime(),
        });
    }



/* --------------------------------------------------------- Use Case ---------
 *	LISTEN
 */

    /**
     * Listens to the specified channel. The talkers are not notified of who's 
     * listening
     * 
     * @param sender_namespace: namespace of the class that is listening
     * @param subcribed_namespace the target that is being subscribed to
     * @param listen  resolution that will be listened for
     * @param callback: function that will be executed when there is a new 
     * signal at the 
     * specified channel
     *
     * @remarks
     * Class: Basecontroller
     * Service: Controller
     */
    public subscribe(
        scope: t_singleScope,
        subcribed_namespace: t_namespace,
        listen: t_resolutionInstructionNoArgs,
        callback: (transmission: t_talk<t_ri0>) => void,
    ): void {

        const expression_trail: t_expressionTrail =
            Resolution.extract_ExpressionTrail(listen);

        const channel: t_channel = subcribed_namespace +
            this.get_Separator("Monologue") +
            expression_trail;

        this._monologue_emitter.on(
            channel,
            callback as (transmission: t_transmission) => void,
        );
    }

    /**
     * 
     *  Similar to subscribe, listens to a specific channel but does not respond
     *  to the source, Unlike subscribe, wait quits listening after a certain 
     *  number of occurences of the  channel, default = 1 also, wait has the 
     *  built in capacity to check whether the received emit meets the expected 
     *  criteria through the test callback
     *
     * @param waiter_namespace namespace of the class that is waiting
     * @param recipient_namespace namespace that is being awaited 
     * @param listen method or announcement to listen to
     * @param test_callback callback for determining whether the channel signal 
     * meets 
     * the wait criteria
     * @param action_callback callback to execute if the test callbak returns true
     * @param total_count number of times wait function will wait for the test 
     * callback to return true
     * @param current_count current iteration count of the wait
     *
     * @remarks
     * Class: Basecontroller
     * Service: Controller
     */
    public wait(
        scope: t_singleScope,
        waiter_namespace: t_namespace,
        recipient_namespace: t_namespace,
        listen: t_resolutionInstructionNoArgs,
        test_callback: (transmission: t_transmission) => boolean = () => true ,
        action_callback: (transmission: t_transmission) => any =
            (transmission) => transmission,
        total_count: number = 1,
        current_count: number = total_count,
    ): Promise<any> {

        return new Promise((resolve, reject) => {

            const once_callback_function = (transmission: t_transmission) => {

                if (test_callback(transmission)) {
                    current_count--;
                    resolve(action_callback(transmission));
                } else {

                    const new_promise = this.wait(
                            scope,
                            waiter_namespace,
                            recipient_namespace,
                            listen,
                            test_callback,
                            action_callback,
                            total_count,
                            current_count,
                        );

                    resolve(new_promise);
                }
            }; 

            if (current_count > 0) {

                const expression_trail: t_expressionTrail =
                    Resolution.extract_ExpressionTrail(
                        listen,
                    );

                const channel: t_channel = recipient_namespace +
                    this.get_Separator("Monologue") +
                    expression_trail;

                return this._monologue_emitter.once(
                    channel,
                    once_callback_function,
                );
            }

        }) // return new promise
            .catch((error_content: any) => {
                console.error(
                    "BaseController.wait.Promise.catch:\n", error_content,
                );
        });
    }

    /**
     * Waits multiple conditions and returns promise when all of them are met
     * 
     * @param waiter_namespace: namespace of the class that is waiting
     * @param wait_set: set of wait conditions to be met
     *
     * @remarks
     * Class: Basecontroller
     * Service: Controller
     */
    public wait_Some(
        scope: t_singleScope,
        waiter_namespace: t_namespace,
        wait_set: t_waitSet[],
    ): Promise<t_transmission[]> {
        return Promise.all(wait_set.map((wait_event: t_waitSet) => {
            return this.wait(
                scope,
                waiter_namespace,
                wait_event.Namespace,
                wait_event.Listen,
                wait_event.Test,
                wait_event.Call,
            );
        }));
    }
}
