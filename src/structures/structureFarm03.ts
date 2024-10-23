import { StructureStateChildI } from "../../typings";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { castleToFarmPaths, DEBUGMODE, Farm03Pos, farmClickBox, farmModels } from "../utils/CONSTANTS";
import { farmUpgradeCostGold, farmUpgradeMax } from "../utils/MATHCONSTANTS";
import { StructureState } from "./structureState";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { AddStructureButton } from "../GUI/structureUpgrades/addStructureButton";
import { StructureUpgradeSection } from "../GUI/structureUpgrades/structureUpgradeSection";
import { checkUpgradeFarmersMax, farmAdditionAllowed, farmAdditionCallback, farmUpgradeAllowed, farmUpgradeCallBack } from "../utils/upgradeHelpers";

export class StructureFarm03 extends StructureState implements StructureStateChildI {
    
    constructor(scene:PlayMode){
        super(scene);
        this._name = 'Farm03'
        this._character = 'farmer';
        this._animationPaths = castleToFarmPaths;
        this._upgradeMax = farmUpgradeMax;
        this._upgradeCostGold = Math.round(farmUpgradeCostGold(this.getUpgradeLevel())*1000/1000);
        this._upgradeCostFarmers = 0;
        this._product = null;
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, farmModels, farmClickBox, Farm03Pos);
        this._upgradesWindow = this._scene.farm01.getUpgradesWindow(); //shared window
        this._upgradeSection = new StructureUpgradeSection('3rd Farm Upgrades', `next Upgrade allows ${checkUpgradeFarmersMax(this)} farmers on your 3rd farm`, this, () => {farmUpgradeCallBack(this)})
        this._addStructureButton = new AddStructureButton('Farm 3', this, () => {farmAdditionCallback(this, this._scene.farm04.getAddStructureButton())});
        this._addUpgradePanel();
        this._upgradeSection.isVisible = false;

        this._scene.onBeforeRenderObservable.add(() => {
        
            this.getUpgradeSection().upgradeAble = farmUpgradeAllowed(this);
            farmAdditionAllowed(this);
        })
    }

    public upgradeState() {
            
        if (DEBUGMODE) {
            debugUpgradeState(this._name, this.getUpgradeLevel());
        }
        
        if (this.getUpgradeLevel() < this._upgradeMax) {
            //change the structures
            switch(this.getUpgradeLevel()) {
                case 1 :  {
                    this._structureModels.hideModel(0);
                    this._structureModels.showModel(1);
                }
                break;
            }

            this._upgradeLevel += 1;

            this.notifyObserversOnUpgrade();

            this.getUpgradeSection().instruction = `Next upgrade allows ${checkUpgradeFarmersMax(this)} farmers on your 1st farm`
            this.getUpgradeSection().textBlockUpgradeInstruction.text = this.getUpgradeSection().instruction;

            this._upgradeCostGold = Math.round(farmUpgradeCostGold(this.getUpgradeLevel())*1000)/1000;

        }

    }

}