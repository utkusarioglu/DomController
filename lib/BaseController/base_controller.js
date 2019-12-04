"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_emitter_1 = require("@utkusarioglu/event-emitter");
const resolver_1 = require("@utkusarioglu/resolver");
const separator_handler_1 = require("../Common/separator_handler");
const c_controller_1 = require("../Common/c_controller");
class BaseController extends separator_handler_1.SeparatorHandler {
    constructor(controller_scope) {
        super();
        this._monologue_emitter = new event_emitter_1.EventEmitter().setMaxListeners(20);
        this._dialogue_emitter = new event_emitter_1.EventEmitter().setMaxListeners(20);
        this._announcement_archive = [];
        this._dialogue_archive = [];
        this._controller_scope = controller_scope;
    }
    request(scope, sender_namespace, recipient_namespace, talk, group) {
        const service_id = BaseController.create_RandomServiceId();
        const request_channel = recipient_namespace +
            this.get_Separator("Dialogue") +
            group;
        const response_channel = request_channel +
            this.get_Separator("Id") +
            service_id;
        const request_packet = {
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
                .once((response_channel), (response_packet) => {
                response_packet.sniff("Error", resolve.bind(null, response_packet), reject.bind(null, response_packet));
                this.archive_Dialogue(request_packet, response_packet);
            });
            this._dialogue_emitter.emit(request_channel, request_packet);
        });
    }
    respond(responder_namespace, response_callback, group, scope) {
        const listen_channel = responder_namespace +
            this.get_Separator("Dialogue") +
            group;
        this._dialogue_emitter.on(listen_channel, (transmission) => {
            response_callback(transmission)
                .then((requested_return_content) => {
                const serve_packet = {
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
                    .emit(transmission.Channel, serve_packet);
            })
                .catch((error) => {
                console.log("serve error:", error);
            });
        });
    }
    archive_Dialogue(request_packet, response_packet) {
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
    static create_RandomServiceId() {
        return Math.random().toString().slice(2);
    }
    get_DialogueArchive() {
        return this._dialogue_archive;
    }
    publicget_ServedChannels() {
        return this._dialogue_emitter.eventNames();
    }
    announce(scope, sender_namespace, recipient_namespace, talk, delay = false) {
        const expression_trail = resolver_1.Resolution.extract_ExpressionTrail(talk);
        const announcement_channel = recipient_namespace +
            this.get_Separator("Monologue") +
            expression_trail;
        const announcement_packet = {
            Channel: announcement_channel,
            Sender: sender_namespace,
            Recipient: recipient_namespace,
            Talk: talk,
            Time: (new Date()).getTime(),
            Static: false,
            Scope: scope,
        };
        const do_announcement = () => {
            this._monologue_emitter.emit(announcement_channel, announcement_packet);
            this.archive_Announcement(sender_namespace, announcement_channel, announcement_packet);
        };
        if (delay) {
            if (delay === true) {
                delay = c_controller_1.C_Controller.GraceTime;
            }
            setTimeout(do_announcement, delay);
        }
        else {
            do_announcement();
        }
    }
    get_AnnouncementArchive() {
        return this._announcement_archive;
    }
    archive_Announcement(sender_namespace, announcement_channel, announcement_packet = null) {
        this._announcement_archive.push({
            Namespace: sender_namespace,
            Channel: announcement_channel,
            Content: announcement_packet,
            Time: (new Date()).getTime(),
        });
    }
    subscribe(scope, subcribed_namespace, listen, callback) {
        const expression_trail = resolver_1.Resolution.extract_ExpressionTrail(listen);
        const channel = subcribed_namespace +
            this.get_Separator("Monologue") +
            expression_trail;
        this._monologue_emitter.on(channel, callback);
    }
    wait(scope, waiter_namespace, recipient_namespace, listen, test_callback = () => true, action_callback = (transmission) => transmission, total_count = 1, current_count = total_count) {
        return new Promise((resolve, reject) => {
            const once_callback_function = (transmission) => {
                if (test_callback(transmission)) {
                    current_count--;
                    resolve(action_callback(transmission));
                }
                else {
                    const new_promise = this.wait(scope, waiter_namespace, recipient_namespace, listen, test_callback, action_callback, total_count, current_count);
                    resolve(new_promise);
                }
            };
            if (current_count > 0) {
                const expression_trail = resolver_1.Resolution.extract_ExpressionTrail(listen);
                const channel = recipient_namespace +
                    this.get_Separator("Monologue") +
                    expression_trail;
                return this._monologue_emitter.once(channel, once_callback_function);
            }
        })
            .catch((error_content) => {
            console.error("BaseController.wait.Promise.catch:\n", error_content);
        });
    }
    wait_Some(scope, waiter_namespace, wait_set) {
        return Promise.all(wait_set.map((wait_event) => {
            return this.wait(scope, waiter_namespace, wait_event.Namespace, wait_event.Listen, wait_event.Test, wait_event.Call);
        }));
    }
}
exports.BaseController = BaseController;
//# sourceMappingURL=base_controller.js.map