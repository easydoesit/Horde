import { StructureStateChildI } from "../../typings";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE, farmToTavernPaths, tavernClickBox, tavernModels, tavernPos,} from "../utils/CONSTANTS";
import { tavernCreateGoldAmount, tavernUpgradeCostFarmers, tavernUpgradeCostGold, tavernUpgradeMax, timeToMakeRelic } from "../utils/MATHCONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { StructureState } from "./structureState";

export class StructureTavern extends StructureState implements StructureStateChildI {
    constructor(name:string, scene:PlayMode) {
        super(name, scene);
        this._character = 'adventurer';
        this._animationPaths = farmToTavernPaths;

        this._upgradeMax = tavernUpgradeMax;
        this._upgradeLevel = 0;
        this._upgradeCostGold = Math.round(tavernUpgradeCostGold(this.getUpgradeLevel())*1000/1000);
        this._upgradeCostFarmers = Math.round(tavernUpgradeCostFarmers(this.getUpgradeLevel()));
        this._product = 'Relics';
        this._timeToMakeProduct = timeToMakeRelic(this.getUpgradeLevel());
        this._structureModels = new StructureModel(`${this.name}_models`, this._scene, tavernModels, tavernClickBox, tavernPos);
        this._createGoldAmount = tavernCreateGoldAmount;

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
            this._timeToMakeProduct = timeToMakeRelic(this.getUpgradeLevel());
      
            //update the observers
            this.notify();

            this._upgradeCostFarmers = tavernUpgradeCostFarmers(this.getUpgradeLevel());
            this._upgradeCostGold = Math.round(tavernUpgradeCostGold(this.getUpgradeLevel())*1000)/1000;

        }
    }   
}