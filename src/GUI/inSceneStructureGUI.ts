import { Rectangle, TextBlock, Control, Button} from "@babylonjs/gui";
import { GUIFONT1 } from "../utils/CONSTANTS";
import { ResourcesT, StructureStateChildI } from "../../typings";

export class InSceneStuctureGUI extends Button {
    private _animatedBarWrapper:Rectangle;
    private _animatedBar:Rectangle
    private _structure:StructureStateChildI
    private _speed:number;
    private _infoText:TextBlock;
    private _barMoving:boolean;
    private _barMoveRequested:boolean

    public name:string;

    constructor(name:string, structure:StructureStateChildI, resource:ResourcesT) {
        super(name);
        
        this._structure = structure;
        this._barMoving = false;
        this._barMoveRequested = false;

        this._speed = this._structure.getResourceCycleTime();

        this.width = '125px';
        this.height = '40px';

        this.onPointerDownObservable.add(() => {
            this._structure.getUpgradesWindow().isVisible = true;
        });


        this.linkOffsetY = -90;
        this.zIndex = -100;

        this._infoText = new TextBlock (`${resource}_info`,`${this._structure.getResourcePerCycle().toFixed(3)} ${resource}/cycle`)
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

            this._speed = this._structure.getResourceCycleTime();

            //if the steward exist automatically animate the bar
            if(this._structure.getSteward()) {
                
                if(this._structure.getUpgradeLevel() > 0) {
                    this.moveBar();
                }

            } else if (this._barMoveRequested){
                if(this._structure.getUpgradeLevel() > 0) {
                    this.moveBar();
                }
            }

        })

    }
        
    public moveBar() {
        this._barMoving = true;
        
        if (this._animatedBar._width.value < 1) {

            this._animatedBar.width = this._animatedBar._width.value + (this._speed * this._structure.getScene().getEngine().getDeltaTime()/1000);
        
        } else {
        
            this._animatedBar.width = 0;
            //add resource to the game.
        
            this._structure.addResource(this._structure.getResourcePerCycle());
            this._structure.notifyObserversOnCycle();

            //add gold to MathState
            this._structure.getScene().mathState.addGold(this._structure.getGoldPerCycle());
            
            this._barMoving = false;
            this._barMoveRequested = false;
        }
        
    }

    public changeInfoText(text:string) {
        this._infoText.text = text;
    }

    public requestBarMove() {
        
        if (!this._barMoving) {
            this._barMoveRequested = true;
        } 
    }

}