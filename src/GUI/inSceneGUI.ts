import { AdvancedDynamicTexture, Button, Rectangle, TextBlock, Control} from "@babylonjs/gui";
import { GUIFONT1 } from "../utils/CONSTANTS";
import { GUIPlay } from "./GUIPlay";
import { PlayMode } from "../scenes/playmode";
import { TransformNode } from "@babylonjs/core";

export class InSceneGUI extends Rectangle {
    private _animatedBarWrapper:Rectangle;
    private _actor:TransformNode;
    private _gui:GUIPlay;

    constructor(name:string, gui:GUIPlay, actor:TransformNode) {
        super(name);

        this._actor = actor;

        this._gui = gui;

        this.width = '200px';
        this.height = '40px';
        
        //you add the control
        this._gui.gameGUI.addControl(this);
        
        //before you link to mesh
        this.linkWithMesh(this._actor);
        this.linkOffsetY = -100;

        this._animatedBarWrapper = new Rectangle('animatedBarRect');
        this._animatedBarWrapper.background = 'red';
        this._animatedBarWrapper.height = .2;
        this._animatedBarWrapper.width = 1;
        this.addControl(this._animatedBarWrapper);


    }
}