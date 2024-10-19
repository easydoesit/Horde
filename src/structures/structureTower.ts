import { StructureStateChildI } from "../../typings";
import { InSceneStuctureGUI } from "../GUI/inSceneStructureGUI";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE, farmToTowerPaths, towerClickBox, towerModels, towerPos  } from "../utils/CONSTANTS";
import { portalsPerCycle, timeToMakePortal, towerCreateGoldAmount, towerUpgradeCostFarmers, towerUpgradeCostGold, towerUpgradeMax } from "../utils/MATHCONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { StructureState } from "./structureState";

export class StructureTower extends StructureState implements StructureStateChildI {
    constructor(scene:PlayMode) {
        super(scene);
        this._name = 'Tower';
        this._character = 'wizard';
        this._animationPaths = farmToTowerPaths;
        this._upgradeMax = towerUpgradeMax;
        this._upgradeLevel = 0;
        this._upgradeCostGold = Math.round(towerUpgradeCostGold(this.getUpgradeLevel())*1000/1000);
        this._upgradeCostFarmers = Math.round(towerUpgradeCostFarmers(this.getUpgradeLevel()));
        this._product = 'Portals';
        this._cycleTime = timeToMakePortal(this.getUpgradeLevel());
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, towerModels, towerClickBox, towerPos);
        this._goldPerCycle = towerCreateGoldAmount;
        this._productAmountPerCycle = portalsPerCycle;
        this._inSceneGui = new InSceneStuctureGUI('TowerSceneGui', this, 'Portals');
    }

    public upgradeState(): void {
        
        if (DEBUGMODE) {
            debugUpgradeState(this._name, this.getUpgradeLevel());
        }

        if (this.getUpgradeLevel() < this.getUpgradeMax()) {
            //change the structures
            switch(this.getUpgradeLevel()) {
                case 1 :  {
                    this._structureModels.hideModel(0);
                    this._structureModels.showModel(1);
                }
                break;
            }

            this._animateCharacters();
    
            //update the variables
            //these ones are before the notify
            this._upgradeLevel += 1;
            this._cycleTime = timeToMakePortal(this.getUpgradeLevel());
      
            //update the observers
            this.notifyObserversOnUpgrade();

            this._upgradeCostFarmers = towerUpgradeCostFarmers(this.getUpgradeLevel());
            this._upgradeCostGold = Math.round(towerUpgradeCostGold(this.getUpgradeLevel())*1000)/1000;

        }
    }   
}