import { Rectangle, TextBlock, Control} from "@babylonjs/gui";
import { GUIFONT1 } from "../utils/CONSTANTS";
import { GUIPlay } from "./GUIPlay";
import { TransformNode } from "@babylonjs/core";
import { DEBUGMODE } from "../utils/CONSTANTS";

import { ProductsT, StructureI, StructureObserverI } from "../../typings";

export class InSceneStuctureGUI extends Rectangle implements StructureObserverI {
    private _animatedBarWrapper:Rectangle;
    private _animatedBar:Rectangle
    private _structure:StructureI
    private _actor:TransformNode;
    private _gui:GUIPlay;
    private _speed:number;
    private _infoText:TextBlock;
    private _product:ProductsT;

    public name:string;

    constructor(name:string, gui:GUIPlay, structure:StructureI, product:ProductsT) {
        super(name);
        
        this._structure = structure;
        this._structure.attach(this);

        this._actor = this._structure.structureModels;
        this._gui = gui;
        this._speed = 0;
        this._product = product;

        this.width = '125px';
        this.height = '40px';
        
        //you add the control
        this._gui.gameGUI.addControl(this);
        
        //before you link to mesh
        this.linkWithMesh(this._actor);
        this.linkOffsetY = -90;
        this.zIndex = -100;

        this._infoText = new TextBlock (`${product}_info`,`${this._speed} ${product}/s`)
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

    }
        
    //costOfItem:number, otherCostofItem:number | null,
    private _moveBar() {
     
        if (this._animatedBar._width.value < 1) {
        
            this._animatedBar.width = this._animatedBar._width.value + (this._speed * this._gui.scene.getEngine().getDeltaTime()/1000);
        
        } else {
        
            this._animatedBar.width = 0;
            //add _product to the game.
       
            this._gui.scene.mathState.addProduct(this._product, 1);
        }

    }

    public updateStructure(structure: StructureI): void {
        
        if(DEBUGMODE) {
            console.log(`updating ${this.name} from ${structure.name}`);
        }

        this._speed = structure.timeToMakeProduct;
        this._infoText.text = `${this._speed} ${this._product}/s`;
    
    }

}