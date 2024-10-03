import { AdvancedDynamicTexture, Button, Rectangle, TextBlock, Control} from "@babylonjs/gui";
import { GUIFONT1 } from "../utils/CONSTANTS";
import { GUIPlay } from "./GUIPlay";
import { PlayMode } from "../scenes/playmode";
import { TransformNode } from "@babylonjs/core";

import { IStateCallback, StructureI } from "../../typings";

export class InSceneStuctureGUI extends Rectangle {
    private _animatedBarWrapper:Rectangle;
    private _animatedBar:Rectangle
    private _actor:TransformNode;
    private _gui:GUIPlay;
    private _stateCallback:IStateCallback | StructureI;
    private _speed:number;
    private _infoText:TextBlock;
    private _itemBuilt:string;

    constructor(name:string, gui:GUIPlay, actor:TransformNode, stateCallback:IStateCallback | null, itemBuilt:string) {
        super(name);

        this._actor = actor;
        this._gui = gui;
        this._stateCallback = stateCallback;
        this._speed = 0;
        this._itemBuilt = itemBuilt;

        this.width = '200px';
        this.height = '50px';
        
        //you add the control
        this._gui.gameGUI.addControl(this);
        
        //before you link to mesh
        this.linkWithMesh(this._actor);
        this.linkOffsetY = -100;

        this._infoText = new TextBlock (`${itemBuilt}_info`,`${this._speed} ${itemBuilt}/second`)
        this._infoText.fontFamily = GUIFONT1;
        this._infoText.color = 'white';
        this._infoText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this._infoText.top = -10;
        this.addControl(this._infoText);

        this._animatedBarWrapper = new Rectangle('animatedBarWrapper');
        this._animatedBarWrapper.background = 'red';
        this._animatedBarWrapper.height = .5;
        this._animatedBarWrapper.width = 1;
        this._animatedBarWrapper.thickness = 0;
        this._animatedBarWrapper.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this._animatedBarWrapper.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this._animatedBarWrapper.top = -.2;
        this.addControl(this._animatedBarWrapper);

        this._animatedBar = new Rectangle('animatedBar');
        this._animatedBar.background = 'green';
        this._animatedBar.height = 1;
        this._animatedBar.width = 0;
        this._animatedBar.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this._animatedBarWrapper.addControl(this._animatedBar);

        this._gui.scene.onBeforeRenderObservable.add(() => {
            this._moveBar();
        })

        //Register the callback with the state
        if (this._stateCallback) {
            this._stateCallback.setOnStateChangeCallback(this.updateGUI.bind(this));
        }
    }
        
    private updateGUI(stateInfo: {speed:number}) {
        this._speed = stateInfo.speed;
        this._infoText.text = `${this._speed} ${this._itemBuilt}/second`;
    }

    //costOfItem:number, otherCostofItem:number | null,
    private _moveBar() {
        if (this._animatedBar._width.value < 1) {
            this._animatedBar.width = this._animatedBar._width.value + (this._speed * this._gui.scene.getEngine().getDeltaTime()/1000);
        } else {
            this._animatedBar.width = 0;
            //add ore to the game.
            this._gui.scene.mathState.totalOre++;
        }

    }

}