import { i_map } from "./t_controller";

/**
 * Handles getting and setting of separator strings
 */
export abstract class SeparatorHandler {

    protected static _SEPARATOR: i_map<string>;


/*
 * ======================================================= Boundary 1 =========
 *
 *	INSTANTIATION
 *
 * ============================================================================
 */
    /**
     * Handles setting and getting of separator strings
     */
    constructor() {
        this.set_Separators_FromGlobal();
    }

/*
 * ======================================================= Boundary 1 =========
 *
 *	DECLARATION
 *
 * ============================================================================
 */

/* --------------------------------------------------------- Use Case ---------
 *	HANDLE SEPARATORS
 */

    /**
     * Imports separators if they are available globally
     */
    protected set_Separators_FromGlobal(): void {
        if (global.hasOwnProperty("Separator")) {
            this.set_Separators(
                // @ts-ignore
                global.Separator,
            );
        } else {
            this.set_Separators({
                Directory: "/",
                Expression: ".",
                Id: "-",
                Dialogue: "?",
                Monologue: ":",
                Namespace: "/",
                Extension: ".",
            });
        }
    }

    /**
     * Sets internal separators for Controller class
     * 
     * @param separators
     */
    protected set_Separators(separators: i_map<string>): void {
        SeparatorHandler._SEPARATOR = separators;
    }

    /**
     * Returns the separator string for the specified name
     * 
     * @param separator_name
     */
    protected get_Separator(separator_name: string): string {
        return SeparatorHandler._SEPARATOR[separator_name];
    }
}
