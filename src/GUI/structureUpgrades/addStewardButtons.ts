import { Button, TextBlock } from"@babylonjs/gui";
import { MathStateI, StructureStateChildI } from "../../../typings";
import { GUIFONT1 } from "../../utils/CONSTANTS";
import { PlayMode } from "../../scenes/playmode";

export class AddStewardButton extends Button {
    private _structure:StructureStateChildI;
    private _scene:PlayMode
    private _mathState:MathStateI;

    private _text:TextBlock;
    private _costGoldText:TextBlock;

    constructor(name:string, structure:StructureStateChildI) {
        super(name);

        this._structure = structure;
        this._scene = structure.getScene();

        this.background = 'orange';
        this.width = .95;
        this.height = '100px';
        this.paddingBottom = '6px';
        this.paddingTop = '6px';
        this.thickness = 0;

        this._text = new TextBlock(`add ${structure.getName()} steward`, `Add Steward to ${structure.getName()}`);
        this._text.fontFamily = GUIFONT1;
        this._text.color = 'white';
        this._text.top = -20;
        this.addControl(this._text);

        this._costGoldText = new TextBlock('costInGold', `Cost Gold: ${this._structure.getStewardCost()}`);
        this._costGoldText.fontFamily = GUIFONT1;
        this._costGoldText.color = 'white';
        this.addControl(this._costGoldText);

        this.waitForScene();

    }

    private async waitForScene():Promise<void> {
        await this._scene.whenReadyAsync()
        .then(() => {
            this._mathState = this._scene.mathState;
            this._structure.getUpgradesWindow().getPanelContainer().addControl(this);
            
            this.onPointerDownObservable.add(() => {
                this._structure.changeSteward(true);
                this.isEnabled = false;
                
            })

            //GameLoop
            this._scene.onBeforeRenderObservable.add(() => {
                if (!this._structure.getSteward()) {
                    this._makeButtonEnabled();
                }
            })
        })
    }

    private _makeButtonEnabled() {
        if (this._structure.getStewardCost() <= this._mathState.getTotalGold()) {
            this.isEnabled = true;
        } else {
            this.isEnabled = false;
        }
    };

}