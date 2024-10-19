import { Rectangle, TextBlock, Control} from "@babylonjs/gui";
import { GUIFONT1 } from "../utils/CONSTANTS";
import { GUIPlay } from "./GUIPlay";
import { TransformNode } from "@babylonjs/core";
import { DEBUGMODE } from "../utils/CONSTANTS";

import { ProductsT, StructureStateChildI } from "../../typings";

export class InSceneStuctureGUI extends Rectangle {
    private _animatedBarWrapper:Rectangle;
    private _animatedBar:Rectangle
    private _structure:StructureStateChildI
    private _speed:number;
    private _infoText:TextBlock;

    public name:string;

    constructor(name:string, structure:StructureStateChildI, product:ProductsT) {
        super(name);
        
        this._structure = structure;

        this._speed = this._structure.getProductCycleTime();

        this.width = '125px';
        this.height = '40px';
        
        this.linkOffsetY = -90;
        this.zIndex = -100;

        this._infoText = new TextBlock (`${product}_info`,`${this._structure.getProductPerCycle().toFixed(3)} ${product}/cycle`)
        this._infoText.fontFamily = GUIFONT1;
        this._infoText.fontSize = 12;
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

        this._structure.getScene().onBeforeRenderObservable.add(() => {
            this._speed = this._structure.getProductCycleTime();

            if(this._structure.getUpgradeLevel() > 0) {
                this._moveBar();
            }
        })

    }
        
    //costOfItem:number, otherCostofItem:number | null,
    private _moveBar() {
     
        if (this._animatedBar._width.value < 1) {
        
            this._animatedBar.width = this._animatedBar._width.value + (this._speed * this._structure.getScene().getEngine().getDeltaTime()/1000);
        
        } else {
        
            this._animatedBar.width = 0;
            //add _product to the game.
       
            this._structure.addProduct(this._structure.getProductPerCycle());
            this._structure.notifyObserversOnCycle();
        }

    }

    public changeInfoText(text:string) {
        this._infoText.text = text;
    }

}