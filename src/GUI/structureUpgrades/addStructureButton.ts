import { Button, TextBlock } from"@babylonjs/gui";
import { GUIFONT1 } from "../../utils/CONSTANTS";
import { MathStateI, StructureStateChildI } from "../../../typings";
import { UpgradeWindow } from "../upgradeWindow";
import { StructureUpgradeSection } from "./structureUpgradeSection";

export class AddStructureButton extends Button {
    private _mathState:MathStateI;
    private _structure:StructureStateChildI;

    public available:boolean;
    public visible:boolean;

    private _text:TextBlock;
    private _costGoldText:TextBlock;
    private _costFarmersText:TextBlock;

    constructor(name:string, structure:StructureStateChildI, callback:(...args:any[]) => any ) {
        super(name);

        this._structure = structure;
        this.available = false;
        this.visible = false;

        this.background = 'Green';
        this.width = .95;
        this.height = '100px';
        this.paddingBottom = '6px';
        this.paddingTop = '6px';
        this.thickness = 0;
        this.left =0;

        this._text = new TextBlock(`add${structure.getName()}`, `Add ${structure.getName()}`);
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

        this.waitForScene(callback);

    }

    private async waitForScene(callback:(...args:any[]) => any):Promise<void> {
        
        await this._structure.getScene().whenReadyAsync()
        .then(() => {
            this._mathState = this._structure.getScene().mathState;
  
            this.onPointerDownObservable.add(() => {
            
                if (this._structure.getUpgradeCostFarmers()) {
    
                    if(this._mathState.getTotalGold() >= this._structure.getUpgradeCostGold() && this._mathState.getTotalFarmers() >= this._structure.getUpgradeCostFarmers()) {
                    
                        this._addStructureFlow(this._structure.getUpgradeSection());
    
                    }
                    
                } else {
                    
                    if(this._mathState.getTotalGold() >= this._structure.getUpgradeCostGold()) {
    
                        this._addStructureFlow(this._structure.getUpgradeSection());
    
                    }
    
                }
    
                if (callback) {
                    callback();
                }
    
            });
            
        });
    }

    private _addStructureFlow(upgradeSection:StructureUpgradeSection) {
        //hide this button
        this.isVisible = false;

        //move the _structure into view
        const structure = this._structure.getStructureModels();
        structure.position.y = structure.gamePosition.y;
        structure.showModel(0);

        //do the scene animations here

        //upgrade the state
        this._structure.upgradeState();

        //update the GUI
        upgradeSection.changeGoldCost(this._structure.getUpgradeCostGold());
        
        if (this._structure.getUpgradeCostFarmers()) {
            upgradeSection.changeFarmerCost(this._structure.getUpgradeCostFarmers());
        }

    }
}