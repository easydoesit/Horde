import { MathStateI, UpgradeWindowI } from "../../../typings";
import { PlayMode } from "../../scenes/playmode";
import { mineUpgradeMax } from "../../utils/MATHCONSTANTS";
import { GUIPlay } from "../GUIPlay";
import { UpgradeWindow } from "../upgradeWindow";
import { AddStructureButton } from "../structureUpgrades/addStructureButton";

export class CastleUpgradeWindow extends UpgradeWindow implements UpgradeWindowI {
    private _scene:PlayMode;
    private _mathState:MathStateI;
    //private _addMineButton:AddStructureButton;
    private _buttons:{name:string, button:AddStructureButton}[];
    private _addForgeButton:AddStructureButton;
    private _addBarracksButton:AddStructureButton;
    private _addThievesGuildButton:AddStructureButton;
    private _addWorkShopButton:AddStructureButton;
    private _addTowerButton:AddStructureButton;
    private _addTavernButton:AddStructureButton;

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
                console.log(structure);
                const buttonObj = {
                    name:structure.getName(),
                    button:structure.getAddStructureButton()
                }
                this.getPanelContainer().addControl(buttonObj.button);
                //this.getPanelContainer().addControl(structure.getUpgradesWindow());
                this._buttons.push(buttonObj);
            }
        }

        console.log('castle buttons', this._buttons)

        this._scene.onBeforeRenderObservable.add(() => {
                //   //mine
                //   if (this._addMineButton.isVisible) {
                //     this._addMineButton.isEnabled = this._mineUpgradeAllow();
                // }    

        });

    }

        //mine
        private _mineUpgradeAllow() {
            if(this._scene.mine.getUpgradeLevel() < mineUpgradeMax) {
                if(this._mathState.getTotalGold() > this._scene.mine.getUpgradeCostGold() && this._mathState.getTotalFarmers() > this._scene.mine.getUpgradeCostFarmers()) {
                    return true;
                } else {
                    return false;
                }
            }
        }
}