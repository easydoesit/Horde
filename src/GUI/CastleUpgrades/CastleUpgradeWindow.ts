import { MathStateI, UpgradeWindowI,CastleUpgradeWindowI } from "../../../typings";
import { PlayMode } from "../../scenes/playmode"
import { GUIPlay } from "../GUIPlay";
import { UpgradeWindow } from "../upgradeWindow";
import { AddStructureButton } from "../structureUpgrades/addStructureButton";
import { KingdomUpgradeButton } from "./kingdomUpgradeButton";

export type structureButtonsT = {name:string, button:AddStructureButton | KingdomUpgradeButton};

export class CastleUpgradeWindow extends UpgradeWindow implements UpgradeWindowI, CastleUpgradeWindowI {
    private _scene:PlayMode;
    private _mathState:MathStateI;
    private _kingdomUpgradeButton:KingdomUpgradeButton;
    private _structureButtons:structureButtonsT[];

    constructor(name:string, scene:PlayMode) {
        super(name);
        this.name = name;
        this._scene = scene;
        this._mathState = this._scene.mathState;
        this._gui = this._scene.getAppGui() as GUIPlay;
        this._structureButtons = [];

        this._kingdomUpgradeButton = new KingdomUpgradeButton(this._scene.kingdomState, this._scene);

        this.getPanelContainer().addControl(this._kingdomUpgradeButton);

        for(let i in this._scene.allStructures) {
            const structure = this._scene.allStructures[i];
            
            if (!structure.getName().includes('Farm')) {
                const buttonObj = {
                    name:structure.getName(),
                    button:structure.getAddStructureButton(),
                }

                this.getPanelContainer().addControl(buttonObj.button);
                this._structureButtons.push(buttonObj);

            }
        }

        this._scene.onBeforeRenderObservable.add(() => {
            for (let i in this._structureButtons) {
                const button = this._structureButtons[i];
                const buttonsStructure = this._scene.getStructure(button.name);
                
                let buttonVisible = false;
                let enoughResourses = false;
                let enoughFarmers = false;
                let enoughGold = false;

                if (button.button.isVisible) {
                    buttonVisible = true;
                }

                if (buttonsStructure.getInitResourceCost()) {

                    for(let j in scene.allStructures) {
                        const structure = scene.allStructures[j];
                        
                        if (structure.getResourceName() === buttonsStructure.getInitResourceName()) {
                            if (structure.getTotalResourceAmount() >= buttonsStructure.getInitResourceCost()) {
                                enoughResourses = true;
                            }
                        }
                    } 
                } else {
                    enoughResourses = true;
                }

                if (buttonsStructure.getInitFarmerCost()) {
                    if(this._mathState.getTotalFarmers() >= buttonsStructure.getInitFarmerCost()) {
                        enoughFarmers = true;
                    } 
                } else {
                    enoughFarmers = true;
                }

                if(this._mathState.getTotalGold() >= buttonsStructure.getInitGoldCost()) {
                    enoughGold = true;
                }

                if(buttonVisible && enoughResourses && enoughFarmers && enoughGold) {
                    button.button.isEnabled = true;
                } else {
                    button.button.isEnabled = false;
                }

            }

        });

    }

    public getStructureButtons(): structureButtonsT[] {
        return this._structureButtons
    }

}