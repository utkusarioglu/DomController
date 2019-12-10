import { SeparatorHandler } from "../Common/separator_handler";
import { i_waitSet, e_ServiceGroup, e_Scope, t_singleScope, t_epoch, i_talk, i_request, i_response, i_dialogueArchiveItem, i_announcementArchiveItem, t_waitActionCallback, t_waitTestCallback, t_wait } from "../Common/t_controller";
import { t_ri } from "@utkusarioglu/resolver";
import { t_namespace } from "@utkusarioglu/namespace";
import { t_ri_any } from "@utkusarioglu/resolver/Common/t_resolver";
export declare class BaseController extends SeparatorHandler {
    private _event_emitter;
    private _monologue_emitter;
    private _dialogue_emitter;
    private _announcement_archive;
    private _dialogue_archive;
    private _controller_scope;
    constructor(controller_scope: t_singleScope, event_emitter: any);
    request<Content>(sender_namespace: t_namespace, recipient_namespace: t_namespace, talk: t_ri_any, scope: e_Scope, group: e_ServiceGroup): Promise<i_response<Content>>;
    respond<Content>(responder_namespace: t_namespace, response_callback: (transmission: i_request) => Promise<Content>, scope: e_Scope, group: e_ServiceGroup): void;
    private archive_Dialogue;
    private static create_RandomServiceId;
    get_DialogueArchive(): Array<i_dialogueArchiveItem>;
    publicget_ServedChannels(): any[];
    announce<TalkRi extends t_ri_any>(sender_namespace: t_namespace, recipient_namespace: t_namespace, talk: TalkRi, scope: t_singleScope, delay?: boolean | t_epoch): void;
    get_AnnouncementArchive(): Array<i_announcementArchiveItem>;
    private archive_Announcement;
    subscribe<TalkArgs>(listen: t_ri, callback: (transmission: i_talk<TalkArgs>) => void, subcribed_namespace: t_namespace, scope: t_singleScope): void;
    wait<TalkArgs, Return>(waiter_namespace: t_namespace, recipient_namespace: t_namespace, listen: t_ri, test_callback: t_waitTestCallback<TalkArgs> | undefined, action_callback: t_waitActionCallback<TalkArgs, Return> | undefined, scope: t_singleScope, total_count?: number, current_count?: number): Promise<t_wait<TalkArgs, Return>>;
    wait_Some<TalkArgs, Return>(scope: t_singleScope, waiter_namespace: t_namespace, wait_set: Array<i_waitSet<TalkArgs, Return>>): Promise<Array<t_wait<TalkArgs, Return>>>;
}
