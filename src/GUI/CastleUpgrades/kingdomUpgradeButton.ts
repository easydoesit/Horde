import { Button, TextBlock } from"@babylonjs/gui";
import { KingdomI, KingdomStateI, KingdomStateObserverI, MathStateI } from "../../../typings";
import { DEBUGMODE, GUIFONT1 } from "../../utils/CONSTANTS";
import { PlayMode } from "../../scenes/playmode";

export class KingdomUpgradeButton extends Button implements KingdomStateObserverI{
    private _kindomState:KingdomStateI;
    private _scene:PlayMode
    private _mathState:MathStateI;
    
    private _text:TextBlock;
    private _costGoldText:TextBlock;

    constructor(kingdomState:KingdomStateI, scene:PlayMode){
        super('kingdomUpgradeButton');
        this._scene = scene;
        this._mathState = scene.mathState;
        this._kindomState = kingdomState;
        this._kindomState.attach(this);

        this.background = 'orange';
        this.width = .95;
        this.height = '100px';
        this.paddingBottom = '6px';
        this.paddingTop = '6px';
        this.thickness = 0;

        this._text = new TextBlock(`Upgrade Kingdom`, `Upgrade Your Kingdom to ${this._kindomState.getNextKingdom().getName()}`);
        this._text.fontFamily = GUIFONT1;
        this._text.color = 'white';
        this._text.top = -20;
        this.addControl(this._text);

        this._costGoldText = new TextBlock('costInGold', `Gost Gold: ${this._kindomState.getNextKingdom().getCostToUnlockGold()}`);
        this._costGoldText.fontFamily = GUIFONT1;
        this._costGoldText.color = 'white';
        this.addControl(this._costGoldText);

        this._scene.onBeforeRenderObservable.add(() => {
            this._makeButtonEnabled();
        })

        this.onPointerDownObservable.add(() => {
            this._kindomState.upgrade();
        })
    }

    public getName(): string {
        return this.name;
    }

    public onKingomStateUpgrade(kingdom: KingdomI): void {
        if (DEBUGMODE) {
            console.log(`On Kingdom State Upgrade Called in Observer ${this.getName()}`);
        }

        if (this._kindomState.getNextKingdom() !== null) {

            this._text.text = `Upgrade Your Kingdom to ${this._kindomState.getNextKingdom().getName()}`;
            this._costGoldText.text = `Gost Gold: ${this._kindomState.getNextKingdom()}`;
        } else {
            this.isVisible = false;
        }
    }

    private _makeButtonEnabled() {

        if (this._kindomState.getNextKingdom() !== null) {
            if (this._mathState.getTotalGold() >= this._kindomState.getNextKingdom().getCostToUnlockGold()) {
                this.isEnabled = true;
            } else {
                this.isEnabled = false;
            }
        
        }

    }

}

