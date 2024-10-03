import { Button, TextBlock } from"@babylonjs/gui";
import { GUIFONT1 } from "../utils/CONSTANTS";
import { UpgradeSection } from "./upgradeSection";
import { FarmState } from "../gameControl/farmState";
import { GUIPlay } from "./GUIPlay";
import { farmCost } from "../utils/MATHCONSTANTS";
import { StructureModel } from "../models_structures/structureModels";

export class ButtonAddFarm extends Button{
    private _guiVertPosition:number;

    public available:boolean;
    public visible:boolean;

    private _text:TextBlock;
    private _costText:TextBlock;

    constructor(name:string, guiVertPosition:number, upgradeSection:UpgradeSection, farmState:FarmState, gui:GUIPlay, nextButton:string | null) {
        super(name);

        this._guiVertPosition = guiVertPosition;
        this.available = false;
        this.visible = false;

        this.top = guiVertPosition;
        this.background = 'Green';
        this.width = .95;
        this.height = .1;
        this.thickness = 0;
        this.left = 0;
        this.isEnabled = true;
        this.isVisible = true;

        this._text = new TextBlock('AddFarm', 'Add Farm');
        this._text.fontFamily = GUIFONT1;
        this._text.color = 'white';
        this.addControl(this._text);

        this._costText = new TextBlock('cost', `Cost: ${farmCost}g`);
        this._costText.fontFamily = GUIFONT1;
        this._costText.color = 'white';
        this._costText.top = 20;

        this.addControl(this._costText);

        this.onPointerDownObservable.add(() =>
            {
                if (gui.scene.mathState.totalGold > farmCost) {

                    //GUI
                    //hide this button
                    this.isVisible = false;

                    //hide this gui so we see the farm
                    gui.GUIWrapperFarmUpgrade.isVisible = false;
                    
                    //upgrade the state
                    farmState.changeState();

                    //apply the cost changes
                    //gui.farmersMax = gui.finalFarmerMaxMath();
                    //gui.farmersMaxTextBox.text = `Max Famers: ${gui.farmersMax}`
                    
                    //upgrade section info
                    upgradeSection.goldCost = farmState.farmUpgradeCost;
                    upgradeSection.instruction = `next Uprade allows ${farmState.farmersNextMax} total farmers on this land`;
                    upgradeSection.textBlockUpgradeInstruction.text = upgradeSection.instruction;
                    
                    //show the Section
                    upgradeSection.wrapperUpgradeContainer.isVisible = true;
                    
                    if(nextButton) {
                    //reveal the next button
                    const searchedButton = gui.GUIWrapperFarmUpgrade.getChildByName(nextButton) as ButtonAddFarm;
                    searchedButton.isVisible = true;
                    }

                    //SCENE
                    //move the farm into view
                    const farm = gui.scene.getNodeByName(farmState.gamePieceName)as StructureModel;
                    farm.position.y = .5;

                }
            }
            
        )
    }

}