import { Resolution } from "@utkusarioglu/resolver";
import { BaseController } from "../BaseController/base_controller";
import { SeparatorHandler } from "../Common/separator_handler";
import { C_Controller } from "../Common/c_controller";
import { e_ServiceGroup, e_Scope, } from "../Common/t_controller";
export class Controller extends SeparatorHandler {
    constructor(namespace) {
        super();
        this.set_GlobalNamespace(namespace);
        return this;
    }
    static flush_GlobalController() {
        Controller._global_controller = new BaseController(e_Scope.Global);
        Controller.flush_GlobalNamespaces();
    }
    request(responding_namespace, talk, scope = e_Scope.Global, group = e_ServiceGroup.Standard) {
        const responding_channel = responding_namespace +
            this.get_Separator("Dialogue") + group;
        const instruction_code = Resolution.produce_UniqueInstructionCode(talk);
        if (Controller.is_StaticResponder(responding_channel) &&
            !Controller._forced_dynamic_service) {
            return Controller._static_content_archive.sniff([
                responding_channel,
                instruction_code,
            ], () => {
                const dynamic_transmission = this.request_DynamicTransmission(responding_namespace, talk, scope, group);
                Controller.set_PromisifiedStaticContent(responding_channel, instruction_code, dynamic_transmission);
                return dynamic_transmission;
            }, (static_transmisson) => {
                console.warn("Serving static content");
                static_transmisson.Time = (new Date()).getTime();
                return Promise.resolve(static_transmisson);
            });
        }
        else {
            return this.request_DynamicTransmission(responding_namespace, talk, scope, group);
        }
    }
    request_DynamicTransmission(recipient_namespace, talk, scope = e_Scope.Global, group = e_ServiceGroup.Standard) {
        return this
            .get_Scopes(scope)[0]
            .request(this._controller_global_namespace, recipient_namespace, talk, scope, group);
    }
    respond(response_func, is_static = true, scope = e_Scope.Global, group = e_ServiceGroup.Standard) {
        if (is_static) {
            Controller._static_responders.push(this._controller_global_namespace +
                this.get_Separator("Dialogue") +
                group);
        }
        this.get_Scopes(scope).forEach((active_scope) => {
            active_scope.respond(this._controller_global_namespace, response_func, scope, group);
        });
        return this;
    }
    get_DialogueArchive(scope) {
        return this.get_Scopes(scope)[0].get_DialogueArchive();
    }
    static set_PromisifiedStaticContent(channel, instruction_code, static_content) {
        static_content
            .then((transmission) => {
            Controller._static_content_archive.pave([
                channel,
                instruction_code,
            ], () => {
                console.warn(C_Controller.E_MultipleRequestsBeforeResponse);
            }, () => {
                transmission.LastDynamicTime = transmission.Time;
                transmission.Time = 0;
                transmission.Static = true;
                return transmission;
            });
        });
    }
    static get_AllStaticChannels() {
        return Controller._static_responders;
    }
    static get_AllStaticContent() {
        return Controller._static_content_archive;
    }
    static flush_StaticContentArchive() {
        Controller._static_content_archive = {};
    }
    static force_AllDynamicService() {
        console.log(C_Controller.E_ForcedDynamic);
        Controller._forced_dynamic_service = true;
    }
    announce(recipient_namespace, talk, scope = e_Scope.Global, delay = false) {
        this.get_Scopes(scope).forEach((active_scope) => {
            active_scope.announce(this._controller_global_namespace, recipient_namespace, talk, scope, delay);
        });
        return this;
    }
    static is_StaticResponder(channel) {
        return this._static_responders.indexOf(channel) !== -1;
    }
    get_AnnouncementArchive(scope) {
        return this.get_Scopes(scope)[0].get_AnnouncementArchive();
    }
    subscribe(listen, callback, subcribed_namespace = this.get_GlobalNamespace(), scope = e_Scope.Global) {
        this.get_Scopes(scope).forEach((active_scope) => {
            active_scope.subscribe(listen, callback, subcribed_namespace, scope);
        });
        return this;
    }
    wait(recipient_namespace, listen, test_callback = () => true, action_callback = () => { }, scope = e_Scope.Global, count = 1, current_count = count) {
        const wait_response = this.get_Scopes(scope)[0].wait(this._controller_global_namespace, recipient_namespace, listen, test_callback, action_callback, scope, count, current_count);
        return wait_response;
    }
    wait_Some(wait_set, scope) {
        return this
            .get_Scopes(scope)[0]
            .wait_Some(scope, this._controller_global_namespace, wait_set);
    }
    set_LocalNamespace(local_namespace) {
        this._controller_local_namespace = local_namespace;
        this.create_LocalNamespace(local_namespace);
        return this;
    }
    get_LocalNamespace() {
        return this._controller_local_namespace;
    }
    get_LocalNamespaces() {
        return Object.keys(Controller._local_controllers);
    }
    set_GlobalNamespace(global_namespace) {
        this._controller_global_namespace = global_namespace;
        this.add_Controller_ToGlobalNamespaces(global_namespace);
        return this;
    }
    get_GlobalNamespace() {
        return this._controller_global_namespace;
    }
    create_LocalNamespace(local_namespace) {
        Controller._local_controllers
            .pave([local_namespace], () => {
        }, () => {
            return new BaseController(e_Scope.Local);
        });
    }
    destroy_LocalNamespace(local_namespace) {
        delete Controller._local_controllers[local_namespace];
    }
    add_Controller_ToGlobalNamespaces(global_namespace) {
        Controller._global_namespaces.push(global_namespace);
    }
    get_GlobalNamespaces() {
        return Controller._global_namespaces;
    }
    static flush_GlobalNamespaces() {
        Controller._global_namespaces = [];
    }
    get_Scopes(scope) {
        const list = [];
        if (scope & 1) {
            if (this._controller_local_namespace) {
                list.push(Controller
                    ._local_controllers[this._controller_local_namespace]);
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
    static get_LocalControllerStack() {
        return Controller._local_controllers;
    }
}
Controller._global_controller = new BaseController(e_Scope.Global);
Controller._local_controllers = {};
Controller._global_namespaces = [];
Controller._static_content_archive = {};
Controller._static_responders = [];
Controller._forced_dynamic_service = false;
//# sourceMappingURL=controller.js.map