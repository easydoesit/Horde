import { StructureStateChildI } from "../../typings";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { barracksClickBox, barracksModels, barracksPos, DEBUGMODE, farmToBarracksPaths } from "../utils/CONSTANTS";
import { barracksCreateGoldAmount, barracksUpgradeCostFarmers, barracksUpgradeCostGold, barracksUpgradeMax, timeToMakeVillage } from "../utils/MATHCONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { StructureState } from "./structureState";

export class StructureBarracks extends StructureState implements StructureStateChildI {
    constructor(scene:PlayMode) {
        super(scene);
        this._name = 'Barracks';
        this._character = 'soldier';
        this._animationPaths = farmToBarracksPaths;
        this._upgradeMax = barracksUpgradeMax;
        this._upgradeCostGold = Math.round(barracksUpgradeCostGold(this.getUpgradeLevel())*1000/1000);
        this._upgradeCostFarmers = Math.round(barracksUpgradeCostFarmers(this.getUpgradeLevel()));
        this._product = 'Villages';
        this._cycleTime = timeToMakeVillage(this.getUpgradeLevel());
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, barracksModels, barracksClickBox, barracksPos);
        this._goldPerCycle = barracksCreateGoldAmount;
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
            this._cycleTime = timeToMakeVillage(this.getUpgradeLevel());
      
            //update the observers
            this.notifyObserversOnUpgrade();

            this._upgradeCostFarmers = barracksUpgradeCostFarmers(this.getUpgradeLevel());

            this._upgradeCostGold = Math.round(barracksUpgradeCostGold(this.getUpgradeLevel())*1000)/1000;

        }
    }   


}