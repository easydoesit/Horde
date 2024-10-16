import { Button, TextBlock } from"@babylonjs/gui";
import { GUIFONT1 } from "../utils/CONSTANTS";
import { GUIPlay } from "./GUIPlay";
import { MathStateI, StructureI } from "../../typings";
import { UpgradeWindow } from "./upgradeWindows";
import { UpgradeSection } from "./upgradeSection";

export class AddStructureButton extends Button {
    private _mathState:MathStateI;
    private structure:StructureI;
    private _wrapper:UpgradeWindow;
    private _guiVertPosition:number;
    private _gui:GUIPlay;

    public available:boolean;
    public visible:boolean;

    private _text:TextBlock;
    private _costGoldText:TextBlock;
    private _costFarmersText:TextBlock;

    constructor(name:string, gui:GUIPlay, upgradeSection:UpgradeSection, wrapper:UpgradeWindow, guiVertPosition:number, structure:StructureI, callback:any ) {
        super(name);

        this._gui = gui
        this._mathState = this._gui.scene.mathState;
        this.structure = structure;
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

        this._text = new TextBlock(`add${structure.name}`, `Add ${structure.name}`);
        this._text.fontFamily = GUIFONT1;
        this._text.color = 'white';
        this._text.top = -20;
        this.addControl(this._text);

        this._costGoldText = new TextBlock('costInGold', `Cost Gold: ${this.structure.upgradeCostGold}`);
        this._costGoldText.fontFamily = GUIFONT1;
        this._costGoldText.color = 'white';
        this.addControl(this._costGoldText);

        if (this.structure.upgradeCostFarmers) {
            this._costFarmersText = new TextBlock('costInFarmers', `Cost Farmers: ${this.structure.upgradeCostFarmers}`);
            this._costFarmersText.fontFamily = GUIFONT1;
            this._costFarmersText.color = 'white';
            this._costFarmersText.top = 20;

            this.addControl(this._costFarmersText);
        }

        this.onPointerDownObservable.add(() => {
            
            if (this.structure.upgradeCostFarmers) {

                if(this._mathState.getTotalGold() >= this.structure.upgradeCostGold && this._mathState.getTotalFarmers() >= this.structure.upgradeCostFarmers) {
                
                    this._addStructureFlow(upgradeSection);

                }
                
            } else {
                
                if(this._mathState.getTotalGold() >= this.structure.upgradeCostGold) {

                    this._addStructureFlow(upgradeSection);

                }

            }

            if (callback) {
                callback();
            }

        });

    }

    private _addStructureFlow(upgradeSection:UpgradeSection) {
        //hide this button
        this.isVisible = false;

        //hide the GUI Wrapper so we see the structure Appear
        this._wrapper.isVisible = false;

        //move the structure into view
        const structure = this.structure.structureModels;
        structure.position.y = structure.gamePosition.y;
        structure.showModel(0);

        //do the scene animations here

        //upgrade the state
        this.structure.upgradeState();

        //update the GUI
        upgradeSection.goldCost = this.structure.upgradeCostGold;
        
        if (this.structure.upgradeCostFarmers) {
            upgradeSection.otherCost[1] = this.structure.upgradeCostFarmers;
        }

    }
}