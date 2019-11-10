/// <reference path="../Controller/controller.ts" />
/*
 *	DEPENDENCIES
 */
import { M_Namespace } from "@utkusarioglu/namespace";

/*
 *	LOCALS
 */
import { Controller } from "../Controller/controller";

/*
 *	CONSTANTS
 */
import { C_Controller } from "../Common/c_controller";

/**
 * Provides autocorrect for M_Controller
 * 
 * @remarks
 * Class: M_Controller
 * Service: Controller
 */
export interface M_Controller extends M_Namespace {}



/**
 * Provides Controller functionality
 * 
 * @requires M_Namespace
 * 
 * @remarks
 * Service: Controller
 */
export abstract class M_Controller {

    private _controller!: Controller;



/*
 * ======================================================= Boundary 1 =========
 *
 *	DECLARATION
 *
 * ============================================================================
 */

    /**
     * Sets or overwrites the controller for the class
     *
     * @remarks
     * Class: M_Controller
     * Service: Controller
     */
    protected set_Controller(): void {

        if (this._controller) {
            throw new Error(C_Controller.E_AlreadyDefined);
        }

        this._controller = new Controller(this.get_GlobalNamespace());

        if (this.has_LocalNamespace()) {
            this._controller.set_LocalNamespace(this.get_LocalNamespace());
        }

    }

    /**
     * Returns the controller for the class
     *
     * @remarks
     * Class: M_Controller
     * Service: Controller
     */
    protected get_Controller(): Controller {

        if (!(this._controller instanceof Controller)) {
            throw new Error(C_Controller.E_CalledBeforeDeclaration);
        }

        return this._controller;
    }

}
