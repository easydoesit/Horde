import { Button, TextBlock } from"@babylonjs/gui";
import { GUIFONT1 } from "../utils/CONSTANTS";
import { GUIPlay } from "./GUIPlay";
import { MathStateI, StructureStateChildI } from "../../typings";
import { UpgradeWindow } from "./upgradeWindows";
import { UpgradeSection } from "./upgradeSection";

export class AddStructureButton extends Button {
    private _mathState:MathStateI;
    private _structure:StructureStateChildI;
    private _wrapper:UpgradeWindow;
    private _guiVertPosition:number;
    private _gui:GUIPlay;

    public available:boolean;
    public visible:boolean;

    private _text:TextBlock;
    private _costGoldText:TextBlock;
    private _costFarmersText:TextBlock;

    constructor(name:string, gui:GUIPlay, upgradeSection:UpgradeSection, wrapper:UpgradeWindow, guiVertPosition:number, _structure:StructureStateChildI, callback:any ) {
        super(name);

        this._gui = gui
        this._mathState = this._gui.scene.mathState;
        this._structure = _structure;
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

        this._text = new TextBlock(`add${_structure.name}`, `Add ${_structure.name}`);
        this._text.fontFamily = GUIFONT1;
        this._text.color = 'white';
        this._text.top = -20;
        this.addControl(this._text);

        this._costGoldText = new TextBlock('costInGold', `Cost Gold: ${this._structure.getUpgradeCostGold()}`);
        this._costGoldText.fontFamily = GUIFONT1;
        this._costGoldText.color = 'white';
        this.addControl(this._costGoldText);

        if (this._structure.getUpgradeCostFarmers()) {
            this._costFarmersText = new TextBlock('costInFarmers', `Cost Farmers: ${this._structure.getUpgradeCostFarmers()}`);
            this._costFarmersText.fontFamily = GUIFONT1;
            this._costFarmersText.color = 'white';
            this._costFarmersText.top = 20;

            this.addControl(this._costFarmersText);
        }

        this.onPointerDownObservable.add(() => {
            
            if (this._structure.getUpgradeCostFarmers()) {

                if(this._mathState.getTotalGold() >= this._structure.getUpgradeCostGold() && this._mathState.getTotalFarmers() >= this._structure.getUpgradeCostFarmers()) {
                
                    this._addStructureFlow(upgradeSection);

                }
                
            } else {
                
                if(this._mathState.getTotalGold() >= this._structure.getUpgradeCostGold()) {

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

        //hide the GUI Wrapper so we see the _structure Appear
        this._wrapper.isVisible = false;

        //move the _structure into view
        const _structure = this._structure.getStructureModels();
        _structure.position.y = _structure.gamePosition.y;
        _structure.showModel(0);

        //do the scene animations here

        //upgrade the state
        this._structure.upgradeState();

        //update the GUI
        upgradeSection.goldCost = this._structure.getUpgradeCostGold();
        
        if (this._structure.getUpgradeCostFarmers()) {
            upgradeSection.otherCost[1] = this._structure.getUpgradeCostFarmers();
        }

    }
}