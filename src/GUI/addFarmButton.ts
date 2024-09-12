import { Button, TextBlock } from"@babylonjs/gui";
import { GUIFONT1 } from "../utils/CONSTANTS";
import { UpgradeSection } from "./upgradeSection";
import { FarmState } from "./farmState";
import { GUIPlay } from "./GUIPlay";
import { farmCost } from "../utils/MATHCONSTANTS";

export class ButtonAddFarm extends Button{
    private _guiVertPosition:number;

    public available:boolean;
    public visible:boolean;

    private _text:TextBlock;

    constructor(name:string, guiVertPosition:number, upgradeSection:UpgradeSection, farmState:FarmState, gui:GUIPlay, nextButton:string | null) {
        super(name);
        console.log(farmState);
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

        this.onPointerDownObservable.add(() =>
            {
                if (gui.totalGold > farmCost) {
                    //hide this button
                    this.isVisible = false;
                    
                    //upgrade the state
                    farmState.changeState();

                    //apply the cost changes
                    gui.farmersMax = gui.finalFarmerMaxMath();
                    gui.farmersMaxTextBox.text = `Max Famers: ${gui.farmersMax}`
                    upgradeSection.cost = farmState.farmUpgradeCost;
                    upgradeSection.instruction = `next Uprade allows ${farmState.farmersNextMax} total farmers on this land`;
                    upgradeSection.textBlockUpgradeInstruction.text = upgradeSection.instruction;

                    
                    //show the Section
                    upgradeSection.wrapperUpgradeContainer.isVisible = true;
                    
                    if(nextButton) {
                    //reveal the next button
                    const searchedButton = gui.playGUIWrapperFarmUpgrade.getChildByName(nextButton) as ButtonAddFarm;
                    searchedButton.isVisible = true;
                    }
                }
            }
            
        )
    }


 
    // public makeEnabled() {
    //     if(this.available) {
    //         this.isEnabled = true;
    //     } else {
    //         this.isEnabled = false;
    //     }
    // }

    // public makeVisible() {
    //     if (this.visible) {
    //         this.isVisible = true;
    //     } else {
    //         this.isVisible = false;
    //     }
    // } 
}