
/* ////////////////////////////////////////////////////////////////////////////
 *
 *	IMPORTS
 *
 * ///////////////////////////////////////////////////////////////////////// */

import {
    i_map,
    t_epoch
} from "./t_controller";
import {
    t_resolutionInstruction,
    t_ri
} from "@utkusarioglu/resolver";





/* ////////////////////////////////////////////////////////////////////////////
 *
 *	GLOBALS
 *
 * ///////////////////////////////////////////////////////////////////////// */

const RI: "RI" = "RI";





/* ////////////////////////////////////////////////////////////////////////////
 *
 *	EXPORTS
 *
 * ///////////////////////////////////////////////////////////////////////// */

export const C_Controller: i_map<string> = {

    /** Namespace to use when a controller wants to talk to all services */
    AllServices: "App",

    /** The duration that is allowed to pass between sequence events. can
     * be removed later on*/
    // @ts-ignore
    GraceTime: 20,

    E_AlreadyDefined: "Controller already defined",
    E_CalledBeforeDeclaration: "Controller called before declaration",
    E_NoScopeSelected: ["There is a problem with the scopes. ",
        "It may be due to undefiend LocalNamespace ",
        "if the code is expected to work in local scope"].join(""),
    E_MultipleRequestsBeforeResponse: "Multiple requests for the content was placed before the promise was resolved",
    E_ForcedDynamic: "All services are forced to be dynamic",
    E_ActiveStepMemberCount: "Active step requires %0 members",
};

export const C_BootState: i_map<t_ri> = {

    /** Class ready t_methodTrail for controller methods to emit/receive */
    ClassReady: [RI, "class_ready"],

    /** Listen ready t_methodTrail for controller methods to emit/receive */
    ListenReady: [RI, "listen_ready"],

    /** Talk ready t_methodTrail for controller methods to emit/receive */
    TalkReady: [RI, "talk_ready"],

    /** Fires when all modules load its content to the respective classes*/
    ModulesReady: [RI, "modules_ready"],

    /** Fires when the node has received all the dependency related service 
     * requests and completely ready for providing service for others
     */
    DependencyReady: [RI, "dependency_ready"],

    /** Operation ready t_methodTrail for controller methods to emit/receive */
    ServerReady: [RI, "server_ready"],

    /** Test ready t_methodTrail for controller methods to emit/receive */
    TestReady: [RI, "test_ready"],

    ModuleInstalled: [RI, "module_installed"],

    LibraryAdded: [RI, "LibraryAdded"],
};

export const C_StartupTalk: i_map<t_ri> = {

    /** t_methodTrail for controller manager node to emit for the start of listen
    * methods by all active nodes*/
    run_Listen: [RI, "run_listen"],

    /** t_methodTrail for controller manager node to emit for the start of talk by
     * all active nodes */
    run_Talk: [RI, "run_talk"],

    /** t_methodTrail for controller managaer node to emit for the nodes to start
     * requesting services from each other*/
    run_Requests: [RI, "run_requests"],

    /** t_methodTrail for controller managaer node to emit for the nodes to start
     * requesting services from each other*/
    run_Modules: [RI, "run_modules"],

    /** t_methodTrail for controller managaer node to emit for the nodes to start
     * requesting services from each other*/
    run_Server: [RI, "run_server"],

    /** t_methodTrail for controller managaer node to emit for the nodes to start
     * requesting services from each other*/
    run_Tests: [RI, "run_tests"],

    /** Declares other services to send their libraries that are targeted to the sender*/
    send_Archive: [RI, "send_Archive"],

    /** Talk from the library holder to the service that is expecting libraries */
    add_Archive: [RI, "add_Archive()"],
    
};


