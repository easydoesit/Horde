import { Control, TextBlock } from "@babylonjs/gui";
import { PlayMode } from "../../scenes/playmode";
import { UpgradeWindow } from "../upgradeWindow";
import { GUIFONT1 } from "../../utils/CONSTANTS";
import { MathStateI } from "../../../typings";
import { AddStructureButton } from "../structureUpgrades/addStructureButton";

export class FarmUpgradeWindow extends UpgradeWindow {
    private _scene:PlayMode;
    private _mathState:MathStateI;

    private _farmersMaxTextBox:TextBlock;
    private _addFarmButtons:AddStructureButton[];
    // private _addFarmButton02:AddStructureButton;
    // private _addFarmButton03:AddStructureButton;
    // private _addFarmButton04:AddStructureButton;

    constructor(name:string, scene:PlayMode) {
        super(name);
        this._scene = scene;
        
        this._farmersMaxTextBox = new TextBlock('MaxFarmers', `Max Famers: 0`);
        this._farmersMaxTextBox.fontFamily = GUIFONT1;
        this._farmersMaxTextBox.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this._farmersMaxTextBox.height = '20px';
        this._farmersMaxTextBox.top = 40;
        this._farmersMaxTextBox.width = .3;
        this._farmersMaxTextBox.color= 'white';
        this.addControl(this._farmersMaxTextBox);

        this._addFarmButtons =[]

        this._waitSceneLoad();
    
    }

    private async _waitSceneLoad():Promise<void>  {
        
        await this._scene.whenReadyAsync()
            .then(() => {
                this._mathState = this._scene.mathState;
                this._farmersMaxTextBox.text = `Max Farmers: ${this._mathState.getFarmersMax()}`
            
                for (let i = 0; i < this._scene.farms.length; i++) {
                    const farm = this._scene.farms[i];
        
                    if (farm.getAddStructureButton()) {
                        const button = farm.getAddStructureButton();
        
                        this.getPanelContainer().addControl(button);
                        this._addFarmButtons.push(button);
                        
                        if (i > 1) {
                            button.isEnabled = false;
                            button.isVisible = false;
                        }
                    }
        
                }
            
            })
    }

    public changeFarmersMaxText(newText:string) {
        this._farmersMaxTextBox.text = newText;
    }
}