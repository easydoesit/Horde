import { StructureStateChildI } from "../../typings";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE, farmToForgePaths, forgeClickBox, forgeModels, forgePos } from "../utils/CONSTANTS";
import { forgeCreateGoldAmount, forgeUpgradeCostFarmers, forgeUpgradeCostGold, forgeUpgradeMax, timeToMakeWeapon } from "../utils/MATHCONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { StructureState } from "./structureState";

export class StructureForge extends StructureState implements StructureStateChildI {
    constructor(name:string, scene:PlayMode) {
        super(name, scene);
        this._character = 'blacksmith';
        this._animationPaths = farmToForgePaths;

        this._upgradeMax = forgeUpgradeMax;
        this._upgradeLevel = 0;
        this._upgradeCostGold = Math.round(forgeUpgradeCostGold(this.getUpgradeLevel())*1000/1000);
        this._upgradeCostFarmers = Math.round(forgeUpgradeCostFarmers(this.getUpgradeLevel()));
        this._product = 'Weapons';
        this._timeToMakeProduct = timeToMakeWeapon(this.getUpgradeLevel());
        this._structureModels = new StructureModel(`${this.name}_models`, this._scene, forgeModels, forgeClickBox, forgePos);
        this._createGoldAmount = forgeCreateGoldAmount;

    }

    public upgradeState(): void {
        
        if (DEBUGMODE) {
            debugUpgradeState(this.name, this.getUpgradeLevel());
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
            this._timeToMakeProduct = timeToMakeWeapon(this.getUpgradeLevel());
      
            //update the observers
            this.notify();

            this._upgradeCostFarmers = forgeUpgradeCostFarmers(this.getUpgradeLevel());

            this._upgradeCostGold = Math.round(forgeUpgradeCostGold(this.getUpgradeLevel())*1000)/1000;

        }
    }   


}