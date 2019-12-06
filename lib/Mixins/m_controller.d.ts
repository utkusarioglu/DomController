/// <reference path="../Controller/controller.d.ts" />
import { M_Namespace } from "@utkusarioglu/namespace";
import { Controller } from "../Controller/controller";
export interface M_Controller extends M_Namespace {
}
export declare abstract class M_Controller {
    private _controller;
    protected set_Controller(): this;
    protected get_Controller(): Controller;
}
