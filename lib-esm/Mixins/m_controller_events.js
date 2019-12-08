import { C_Controller, C_BootState, C_StartupTalk, } from "../Common/c_controller";
import { e_Scope, e_ServiceGroup, } from "../Common/t_controller";
export class M_ControllerEvents {
    include_Subscriptions(subscription_list) {
        if (!this._subscriptions) {
            this._subscriptions = [];
        }
        this._subscriptions.push(...subscription_list);
        return this;
    }
    include_Dependencies(dependencies_list) {
        if (!this._dependencies) {
            this._dependencies = [];
        }
        this._dependencies.push(...dependencies_list);
        return this;
    }
    include_Receptions(reception_list) {
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
        reception_list.forEach((reception) => {
            this._subscriptions.push({
                Scope: reception.Scope,
                Namespace: reception.Namespace || this.get_GlobalNamespace(),
                Listen: reception.Listen,
                Call: reception.Call,
            });
            this._announcements.push({
                Scope: reception.Scope,
                Namespace: reception.Namespace,
                Talk: reception.Talk,
            });
        });
        return this;
    }
    include_Services(services_list) {
        if (!this._services) {
            this._services = [];
        }
        this._services.push(...services_list);
        return this;
    }
    initialize_Controller(sequential_startup = true) {
        this.set_Controller();
        if (sequential_startup) {
            this.get_Controller()
                .wait(C_Controller.AllServices, C_StartupTalk.run_Listen, undefined, () => {
                this.register_Dependencies();
                this.register_Subscriptions();
                this.announce_ToAllServices(C_BootState.ListenReady);
            }, e_Scope.Global);
            this.get_Controller()
                .wait(C_Controller.AllServices, C_StartupTalk.run_Talk, undefined, () => {
                this.register_Announcements();
                this.register_Services();
                this.announce_ToAllServices(C_BootState.TalkReady);
            }, e_Scope.Global);
        }
        else {
            this.register_Dependencies();
            this.register_Subscriptions();
            this.register_Announcements();
            this.register_Services();
        }
        this.announce_ToAllServices(C_BootState.ClassReady, 200);
        return this;
    }
    register_Subscriptions() {
        if (this._subscriptions) {
            this._subscriptions.forEach((subscription) => {
                this.get_Controller().subscribe(subscription.Listen, subscription.Call, subscription.Namespace, subscription.Scope);
            });
        }
    }
    register_Dependencies() {
        if (this._dependencies && this._dependencies.length > 0) {
            this._dependencies
                .forEach((dependency) => {
                this.get_Controller().wait_Some(dependency.Members, dependency.Scope)
                    .then((data) => {
                    return dependency.Call(data);
                })
                    .then(this.announce_ToAllServices.bind(this, C_BootState.DependencyReady));
            });
        }
        else {
            this.announce_ToAllServices(C_BootState.DependencyReady);
        }
    }
    register_Announcements() {
        if (this._announcements) {
            this._announcements.forEach((announcement) => {
                this.get_Controller().announce(announcement.Namespace, announcement.Talk, announcement.Scope);
            });
        }
    }
    register_Services() {
        if (this._services) {
            this._services.forEach((service) => {
                this.get_Controller().respond(service.Call, service.Static || false, service.Scope, e_ServiceGroup.Standard);
            });
        }
    }
    manage_ControllerSequence(sequence_steps, scope, manager_namespace) {
        let TEST;
        const step_promise_stack = [];
        let steps_promise_sequence = Promise.resolve();
        sequence_steps.forEach((step, index) => {
            step_promise_stack[index] =
                this.produce_PromiseStackMember(scope, manager_namespace, step);
            steps_promise_sequence = steps_promise_sequence
                .then(() => {
                return this.produce_StepsPromise(scope, manager_namespace, step_promise_stack, step, index);
            });
        });
        return steps_promise_sequence;
    }
    produce_PromiseStackMember(scope, manager_namespace, step) {
        return new Promise((resolve_step_promise) => {
            return this.get_Controller().wait(manager_namespace, step.Listen, (transmission) => {
                step.List = step.List.filter((value) => {
                    return value !== transmission.Sender;
                });
                return step.List.length < 1;
            }, () => {
                return resolve_step_promise(step.Listen);
            }, scope);
        });
    }
    produce_StepsPromise(scope, manager_namespace, step_promise_stack, step, index) {
        step.sniff(["StartMessage"], undefined, (start_message) => {
            console.log(start_message);
        });
        step.sniff(["Talk"], undefined, (step_talk) => {
            this.get_Controller().announce(manager_namespace, step_talk, scope);
        });
        const index_str = index.toString();
        return step_promise_stack.sniff([index_str], () => {
            throw new Error(C_Controller.E_ActiveStepMemberCount
                .subs(index_str));
        }, () => {
            const active_step_promise_stack = step_promise_stack.slice(0, index + 1);
            return Promise.all(active_step_promise_stack);
        });
    }
    announce_ToAllServices(resolution_instruction, delay = 0) {
        this.get_Controller().announce(C_Controller.AllServices, resolution_instruction, e_Scope.Global, delay);
    }
    announce_LibraryAdded(library_source_namespace) {
        this.get_Controller().announce(C_Controller.AllServices, [
            ...C_BootState.LibraryAdded,
            [library_source_namespace],
        ], e_Scope.Global, true);
    }
}
//# sourceMappingURL=m_controller_events.js.map