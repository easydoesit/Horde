import { StructureStateChildI } from "../../typings";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE, farmToForgePaths, forgeClickBox, forgeModels, forgePos } from "../utils/CONSTANTS";
import { forgeCreateGoldAmount, forgeUpgradeCostFarmers, forgeUpgradeCostGold, forgeUpgradeMax, timeToMakeWeapon } from "../utils/MATHCONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { StructureState } from "./structureState";

export class StructureForge extends StructureState implements StructureStateChildI {
    constructor(scene:PlayMode) {
        super(scene);
        this._name = 'Forge';
        this._character = 'blacksmith';
        this._animationPaths = farmToForgePaths;
        this._upgradeMax = forgeUpgradeMax;
        this._upgradeCostGold = Math.round(forgeUpgradeCostGold(this.getUpgradeLevel())*1000/1000);
        this._upgradeCostFarmers = Math.round(forgeUpgradeCostFarmers(this.getUpgradeLevel()));
        this._product = 'Weapons';
        this._cycleTime = timeToMakeWeapon(this.getUpgradeLevel());
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, forgeModels, forgeClickBox, forgePos);
        this._goldPerCycle = forgeCreateGoldAmount;

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
            this._cycleTime = timeToMakeWeapon(this.getUpgradeLevel());
      
            //update the observers
            this.notifyObserversOnUpgrade();

            this._upgradeCostFarmers = forgeUpgradeCostFarmers(this.getUpgradeLevel());

            this._upgradeCostGold = Math.round(forgeUpgradeCostGold(this.getUpgradeLevel())*1000)/1000;

        }
    }   


}