import { MathStateI, UpgradeWindowI } from "../../../typings";
import { PlayMode } from "../../scenes/playmode"
import { GUIPlay } from "../GUIPlay";
import { UpgradeWindow } from "../upgradeWindow";
import { AddStructureButton } from "../structureUpgrades/addStructureButton";

export class CastleUpgradeWindow extends UpgradeWindow implements UpgradeWindowI {
    private _scene:PlayMode;
    private _mathState:MathStateI;
    private _buttons:{name:string, button:AddStructureButton}[];

    constructor(name:string, scene:PlayMode) {
        super(name);
        this.name = name;
        this._scene = scene;
        this._mathState = this._scene.mathState;
        this._gui = this._scene.getAppGui() as GUIPlay;
        this._buttons = [];

        for(let i in this._scene.allStructures) {
            const structure = this._scene.allStructures[i];
            
            if (!structure.getName().includes('Farm')) {
                const buttonObj = {
                    name:structure.getName(),
                    button:structure.getAddStructureButton(),
                }

                this.getPanelContainer().addControl(buttonObj.button);
                this._buttons.push(buttonObj);

            }
        }

        this._scene.onBeforeRenderObservable.add(() => {
            for (let i in this._buttons) {
                const button = this._buttons[i];

                const buttonsStructure = this._scene.getStructure(button.name);
                
                if (button.button.isVisible) {
                    if(buttonsStructure.getUpgradeLevel() < buttonsStructure.getUpgradeMax()) {
                        
                        if (this._scene.mathState.getTotalGold() > buttonsStructure.getUpgradeCostGold() && this._scene.mathState.getTotalFarmers() > buttonsStructure.getUpgradeCostFarmers()) {
                            button.button.isEnabled = true;
                        }
                        else {
                            button.button.isEnabled = false;
                        }
                    }
                }

            }

        });

    }

}