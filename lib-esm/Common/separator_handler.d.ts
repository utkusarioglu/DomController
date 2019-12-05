import { i_map } from "./t_controller";
export declare abstract class SeparatorHandler {
    protected static _SEPARATOR: i_map<string>;
    constructor();
    protected set_Separators_FromGlobal(): void;
    protected set_Separators(separators: i_map<string>): void;
    protected get_Separator(separator_name: string): string;
}
