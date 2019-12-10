
/*
 *	COMMON CLASSES
 */ 
//import { EventEmitter } from "@utkusarioglu/event-emitter";
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
    i_waitSet,
    e_ServiceGroup,
    e_Scope,
    t_singleScope,
    t_channel,
    t_epoch,
    i_talk,
    i_request,
    i_EventEmitter,
    i_response,
    i_dialogueArchiveItem,
    i_announcement,
    i_announcementArchiveItem,
    i_announcementPacket,
    t_waitActionCallback,
    t_waitTestCallback,
    t_waitPromiseResponse,
    t_wait,
} from "../Common/t_controller";
import {
    t_ri,
    t_expressionTrail,
} from "@utkusarioglu/resolver";
import { t_namespace } from "@utkusarioglu/namespace";
import { EventEmitter } from "@utkusarioglu/event-emitter";
import { t_ri_any } from "@utkusarioglu/resolver/Common/t_resolver";



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
 *	INSTANTIATION
 *
 * ============================================================================
 */

    /**
     * Stores the event emitter class for the basecontroller to instasntiate
     */
    private _event_emitter!: i_EventEmitter;

    /**
     *  Event emitter for talk and listen use cases
     */
    private _monologue_emitter!: i_EventEmitter; // this increase may have some speed cost

    /**
     *  Event emitter for services
     */
    private _dialogue_emitter!: i_EventEmitter; // this increase may have some speed cost;

    /**
     *  Stores runtime announcements
     */
    private _announcement_archive: Array<i_announcementArchiveItem> = [];

    /**
     *  Stores runtime requests and responds
     */
    private _dialogue_archive: Array<i_dialogueArchiveItem> = [];

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
     * @param event_emitter
     * 
     * @remarks
     * Class: Basecontroller
     * Service: Controller
     */
    constructor(
        controller_scope: t_singleScope,
        event_emitter: any
    ) {
        super();
        this._controller_scope = controller_scope;

        this._event_emitter = event_emitter
        this._monologue_emitter = new event_emitter().setMaxListeners(20);
        this._dialogue_emitter = new event_emitter().setMaxListeners(20);

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
    public request<Content>(
        sender_namespace: t_namespace,
        recipient_namespace: t_namespace,
        talk: t_ri_any,
        scope: e_Scope,
        group: e_ServiceGroup,
    ): Promise<i_response<Content>> {

        const service_id: t_serviceId = BaseController.create_RandomServiceId();
        const request_channel: t_channel = recipient_namespace +
            this.get_Separator("Dialogue") +
            group;
        const response_channel: t_channel = request_channel +
            this.get_Separator("Id") +
            service_id;
        const request_packet: i_request = {
            Channel: response_channel,
            Sender: sender_namespace,
            Group: group,
            Recipient: recipient_namespace,
            Talk: talk,
            Id: service_id,
            Time: (new Date()).getTime(),
            Static: false,
            Scope: scope,
        };

        return new Promise((resolve, reject) => {

            this._dialogue_emitter
                .once((response_channel), (response_packet: i_response<Content>) => {

                response_packet.sniff("Error",
                    resolve.bind(null, response_packet),
                    reject.bind(null, response_packet),
                );

                this.archive_Dialogue(request_packet, response_packet);
            });

            this._dialogue_emitter.emit(
                request_channel,
                request_packet as i_request,
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
    public respond<Content>(
        responder_namespace: t_namespace,
        response_callback: (transmission: i_request) => Promise<Content>,
        scope: e_Scope,
        group: e_ServiceGroup,
    ): void {

        const listen_channel: t_channel =
            responder_namespace +
            this.get_Separator("Dialogue") +
            group;

        this._dialogue_emitter.on(listen_channel,
            (transmission: i_request) => {

                response_callback(transmission)
                    .then((requested_return_content: any) => { 

                        const serve_packet: i_response<Content> = {
                            Sender: transmission.Recipient,
                            Recipient: transmission.Sender,
                            Talk: transmission.Talk,
                            Group: group,
                            Channel: transmission.Channel,
                            Id: transmission.Id,
                            Content: requested_return_content,
                            Time: (new Date()).getTime(),
                            Static: false,
                            Scope: scope,
                        };

                        this._dialogue_emitter
                            .emit(
                                transmission.Channel,
                                serve_packet,
                            );

                    }) // then
                    .catch((error) => {
                        // TODO
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
        request_packet: i_request,
        response_packet: i_response<any>,
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
    public get_DialogueArchive(): Array<i_dialogueArchiveItem> {
        return this._dialogue_archive;
    }
    

    /**
     * Returns all the channels that are being served
     *
     * @remarks
     * Class: Basecontroller
     * Service: Controller
     */
    public publicget_ServedChannels(): any[] {
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
    public announce<TalkRi extends t_ri_any>(
        sender_namespace: t_namespace,
        recipient_namespace: t_namespace,
        talk: TalkRi,
        scope: t_singleScope,
        delay: boolean | t_epoch = false,
    ): void {

        const expression_trail: t_expressionTrail =
            // TODO: type t_ri0 needs to be changed after resolver types are updated
            Resolution.extract_ExpressionTrail(talk);

        const announcement_channel: t_channel = recipient_namespace +
            this.get_Separator("Monologue") +
            expression_trail;

        const announcement_packet: i_announcementPacket<TalkRi> = {
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

            if (delay == true) {
                delay = parseInt(C_Controller.GraceTime);
            }

            setTimeout(do_announcement, delay);

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
    public get_AnnouncementArchive(): Array<i_announcementArchiveItem> {
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
    public subscribe<TalkArgs>(
        listen: t_ri,
        callback: (transmission: i_talk<TalkArgs>) => void,
        subcribed_namespace: t_namespace,
        scope: t_singleScope,
    ): void {

        const expression_trail: t_expressionTrail =
            Resolution.extract_ExpressionTrail(listen);

        const channel: t_channel = subcribed_namespace +
            this.get_Separator("Monologue") +
            expression_trail;

        this._monologue_emitter.on(
            channel,
            callback as (transmission: i_talk<TalkArgs>) => void,
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
    public wait<TalkArgs, Return>(
        waiter_namespace: t_namespace,
        recipient_namespace: t_namespace,
        listen: t_ri,
        test_callback: t_waitTestCallback<TalkArgs> = () => true ,
        action_callback: t_waitActionCallback<TalkArgs, Return> =
            (transmission) => transmission,
        scope: t_singleScope,
        total_count: number = 1,
        current_count: number = total_count,
    ): Promise<t_wait<TalkArgs, Return>> {
        // TODO
        // @ts-ignore
        return new Promise((
            resolve2: t_waitPromiseResponse<TalkArgs, Return>,
        ) => {
            const once_callback_function =
                (transmission: i_talk<TalkArgs>) => {

                    if (test_callback(transmission)) {

                        current_count--;
                        resolve2(action_callback(transmission));
                        return action_callback(transmission);
                    } else {

                        const new_promise = this.wait<TalkArgs, Return>(
                            waiter_namespace,
                            recipient_namespace,
                            listen,
                            test_callback,
                            action_callback,
                            scope,
                            total_count,
                            current_count,
                        );

                        resolve2(new_promise);
                        return new_promise;
                    }
                };

            if (current_count > 0) {

                const expression_trail: t_expressionTrail =
                    Resolution.extract_ExpressionTrail(listen);

                const channel: t_channel = recipient_namespace +
                    this.get_Separator("Monologue") +
                    expression_trail;

                this._monologue_emitter.once(
                    channel,
                    once_callback_function,
                );
            }
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
    public wait_Some<TalkArgs, Return>(
        scope: t_singleScope,
        waiter_namespace: t_namespace,
        wait_set: Array<i_waitSet<TalkArgs, Return>>,
    ): Promise<Array<t_wait<TalkArgs, Return>>> {
        return Promise.all(wait_set
            .map((wait_event: i_waitSet<TalkArgs, Return>) => {
                return this.wait(
                    waiter_namespace,
                    wait_event.Namespace,
                    wait_event.Listen,
                    wait_event.Test,
                    wait_event.Call,
                    scope,
                );
        }));
    }
}
