import { StructureStateChildI } from "../../typings";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE, farmToMinePaths, mineClickBox, mineModels, minePos } from "../utils/CONSTANTS";
import { forgeCreateGoldAmount, mineCreateGoldAmount, mineUpgradeCostFarmers, mineUpgradeCostGold, mineUpgradeMax, timeToMakeOre } from "../utils/MATHCONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { StructureState } from "./structureState";

export class StructureMine extends StructureState implements StructureStateChildI {
    constructor(name:string, scene:PlayMode) {
        super(name, scene);
        this._character = 'miner';
        this._animationPaths = farmToMinePaths;

        this._upgradeMax = mineUpgradeMax;
        this._upgradeLevel = 0;
        this._upgradeCostGold = Math.round(mineUpgradeCostGold(this.getUpgradeLevel())*1000/1000);
        this._upgradeCostFarmers = Math.round(mineUpgradeCostFarmers(this.getUpgradeLevel()));
        this._product = 'Ore';
        this._timeToMakeProduct = timeToMakeOre(this.getUpgradeLevel());
        this._structureModels = new StructureModel(`${this.name}_models`, this._scene, mineModels, mineClickBox, minePos);
        this._createGoldAmount = mineCreateGoldAmount;

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
            this._timeToMakeProduct = timeToMakeOre(this.getUpgradeLevel());
      
            //update the observers
            this.notify();

            this._upgradeCostFarmers = mineUpgradeCostFarmers(this.getUpgradeLevel());

            this._upgradeCostGold = Math.round(mineUpgradeCostGold(this.getUpgradeLevel())*1000)/1000;

        }
    }   
}