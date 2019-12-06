import { SeparatorHandler } from "../Common/separator_handler";
import { t_waitSet, t_transmission, e_ServiceGroup, e_Scope, t_singleScope, t_epoch, i_talk, i_Request } from "../Common/t_controller";
import { t_resolutionInstruction, t_resolutionInstructionNoArgs } from "@utkusarioglu/resolver";
import { t_namespace } from "@utkusarioglu/namespace";
export declare class BaseController extends SeparatorHandler {
    private _monologue_emitter;
    private _dialogue_emitter;
    private _announcement_archive;
    private _dialogue_archive;
    private _controller_scope;
    constructor(controller_scope: t_singleScope);
    request(sender_namespace: t_namespace, recipient_namespace: t_namespace, talk: t_resolutionInstruction, scope: e_Scope, group: e_ServiceGroup): Promise<any>;
    respond(responder_namespace: t_namespace, response_callback: (transmission: i_Request) => Promise<any>, scope: e_Scope, group: e_ServiceGroup): void;
    private archive_Dialogue;
    private static create_RandomServiceId;
    get_DialogueArchive(): object[];
    publicget_ServedChannels(): string[];
    announce(sender_namespace: t_namespace, recipient_namespace: t_namespace, talk: t_resolutionInstruction, scope: t_singleScope, delay?: boolean | t_epoch): void;
    get_AnnouncementArchive(): object[];
    private archive_Announcement;
    subscribe(subcribed_namespace: t_namespace, listen: t_resolutionInstructionNoArgs, callback: (transmission: i_talk<any>) => void, scope: t_singleScope): void;
    wait(waiter_namespace: t_namespace, recipient_namespace: t_namespace, listen: t_resolutionInstructionNoArgs, test_callback: ((transmission: t_transmission) => boolean) | undefined, action_callback: ((transmission: t_transmission) => any) | undefined, scope: t_singleScope, total_count?: number, current_count?: number): Promise<any>;
    wait_Some(scope: t_singleScope, waiter_namespace: t_namespace, wait_set: t_waitSet[]): Promise<t_transmission[]>;
}
