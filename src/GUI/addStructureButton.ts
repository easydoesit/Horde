import { Button, TextBlock } from"@babylonjs/gui";
import { GUIFONT1 } from "../utils/CONSTANTS";
import { GUIPlay } from "./GUIPlay";
import { MathStateI, StructureI } from "../../typings";
import { PlayMode } from "../scenes/playmode";
import { UpgradeWindow } from "./upgradeWindows";
import { UpgradeSection } from "./upgradeSection";

export class AddStructureButton extends Button {
    private _mathState:MathStateI;
    private _scene:PlayMode;
    private _gamePiece:StructureI;
    private _wrapper:UpgradeWindow;
    private _guiVertPosition:number;

    public available:boolean;
    public visible:boolean;

    private _text:TextBlock;
    private _costGoldText:TextBlock;
    private _costFarmersText:TextBlock;

    constructor(name:string, gui:GUIPlay, upgradeSection:UpgradeSection, wrapper:UpgradeWindow, guiVertPosition:number, gamePiece:StructureI ) {
        super(name);

        this._mathState = gui.scene.mathState;
        this._scene = gui.scene;
        this._gamePiece = gamePiece;
        this._wrapper = wrapper;

        this._guiVertPosition = guiVertPosition;
        this.available = false;
        this.visible = false;

        this.top = this._guiVertPosition;
        this.background = 'Green';
        this.width = .95;
        this.height = .1;
        this.thickness = 0;
        this.left =0;

        this._text = new TextBlock(`add${gamePiece.name}`, `Add ${gamePiece.name}`);
        this._text.fontFamily = GUIFONT1;
        this._text.color = 'white';
        this._text.top = -20;
        this.addControl(this._text);

        this._costGoldText = new TextBlock('costInGold', `Cost Gold: ${this._gamePiece.upgradeCostGold}`);
        this._costGoldText.fontFamily = GUIFONT1;
        this._costGoldText.color = 'white';
        this.addControl(this._costGoldText);

        this._costFarmersText = new TextBlock('costInFarmers', `Cost Famers: ${this._gamePiece.upgradeCostFarmers}`);
        this._costFarmersText.fontFamily = GUIFONT1;
        this._costFarmersText.color = 'white';
        this._costFarmersText.top = 20;

        this.addControl(this._costFarmersText);

        this.onPointerDownObservable.add(() => {
            if(this._mathState.totalGold > this._gamePiece.upgradeCostGold && this._mathState.totalFarmers > this._gamePiece.upgradeCostFarmers) {
                //hide this button
                this.isVisible = false;

                //hide the GUI Wrapper so we see the gamePiece Appear
                this._wrapper.isVisible = false;

                //move the structure into view
                const structure = this._gamePiece.structureModels;
                structure.position.y = structure.gamePosition.y;
                structure.showModel(0);

                //apply the cost changes
                gui.scene.mathState.totalFarmers -= this._gamePiece.upgradeCostFarmers;
                gui.scene.mathState.totalGold -= this._gamePiece.upgradeCostGold;

                //upgrade the state
                this._gamePiece.upgradeState();

                //update teh GUI
                upgradeSection.goldCost = this._gamePiece.upgradeCostGold;
                upgradeSection.otherCost[1] = this._gamePiece.upgradeCostFarmers;

            
            }

        })
    }
}