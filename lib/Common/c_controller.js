"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RI = "RI";
exports.C_Controller = {
    AllServices: "App",
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
exports.C_BootState = {
    ClassReady: [RI, "class_ready"],
    ListenReady: [RI, "listen_ready"],
    TalkReady: [RI, "talk_ready"],
    ModulesReady: [RI, "modules_ready"],
    DependencyReady: [RI, "dependency_ready"],
    ServerReady: [RI, "server_ready"],
    TestReady: [RI, "test_ready"],
    ModuleInstalled: [RI, "module_installed"],
    LibraryAdded: [RI, "LibraryAdded"],
};
exports.C_StartupTalk = {
    run_Listen: [RI, "run_listen"],
    run_Talk: [RI, "run_talk"],
    run_Requests: [RI, "run_requests"],
    run_Modules: [RI, "run_modules"],
    run_Server: [RI, "run_server"],
    run_Tests: [RI, "run_tests"],
    send_Archive: [RI, "send_Archive"],
    add_Archive: [RI, "add_Archive()"],
};
//# sourceMappingURL=c_controller.js.map