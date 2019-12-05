import { SeparatorHandler } from "../Common/separator_handler";
import { t_waitSet, i_Response, e_ServiceGroup, e_Scope, t_singleScope, t_epoch, i_talk, i_Request } from "../Common/t_controller";
import { t_resolutionInstruction, t_resolutionInstructionNoArgs } from "@utkusarioglu/resolver";
import { t_namespace } from "@utkusarioglu/namespace";
export declare class BaseController extends SeparatorHandler {
    private _monologue_emitter;
    private _dialogue_emitter;
    private _announcement_archive;
    private _dialogue_archive;
    private _controller_scope;
    constructor(controller_scope: t_singleScope);
    request(scope: e_Scope, sender_namespace: t_namespace, recipient_namespace: t_namespace, talk: t_resolutionInstruction, group: e_ServiceGroup): Promise<any>;
    respond(responder_namespace: t_namespace, response_callback: (transmission: i_Request) => Promise<any>, group: e_ServiceGroup, scope: e_Scope): void;
    private archive_Dialogue;
    private static create_RandomServiceId;
    get_DialogueArchive(): object[];
    publicget_ServedChannels(): string[];
    announce(scope: t_singleScope, sender_namespace: t_namespace, recipient_namespace: t_namespace, talk: t_resolutionInstruction, delay?: boolean | t_epoch): void;
    get_AnnouncementArchive(): object[];
    private archive_Announcement;
    subscribe(scope: t_singleScope, subcribed_namespace: t_namespace, listen: t_resolutionInstructionNoArgs, callback: (transmission: i_talk<any>) => void): void;
    wait(scope: t_singleScope, waiter_namespace: t_namespace, recipient_namespace: t_namespace, listen: t_resolutionInstructionNoArgs, test_callback?: (transmission: i_Response) => boolean, action_callback?: (transmission: i_Response) => any, total_count?: number, current_count?: number): Promise<any>;
    wait_Some(scope: t_singleScope, waiter_namespace: t_namespace, wait_set: t_waitSet[]): Promise<i_Response[]>;
}
