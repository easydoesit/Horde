import { StructureStateChildI } from "../../typings";
import { InSceneStuctureGUI } from "../GUI/inSceneStructureGUI";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE, farmToTavernPaths, tavernClickBox, tavernModels, tavernPos,} from "../utils/CONSTANTS";
import { relicsPerCycle, tavernCreateGoldAmount, tavernUpgradeCostFarmers, tavernUpgradeCostGold, tavernUpgradeMax, timeToMakeRelic } from "../utils/MATHCONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { StructureState } from "./structureState";

export class StructureTavern extends StructureState implements StructureStateChildI {
    constructor(scene:PlayMode) {
        super(scene);
        this._name = 'Tavern';
        this._character = 'adventurer';
        this._animationPaths = farmToTavernPaths;
        this._upgradeMax = tavernUpgradeMax;
        this._upgradeCostGold = Math.round(tavernUpgradeCostGold(this.getUpgradeLevel())*1000/1000);
        this._upgradeCostFarmers = Math.round(tavernUpgradeCostFarmers(this.getUpgradeLevel()));
        this._product = 'Relics';
        this._cycleTime = timeToMakeRelic(this.getUpgradeLevel());
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, tavernModels, tavernClickBox, tavernPos);
        this._goldPerCycle = tavernCreateGoldAmount;
        this._productAmountPerCycle = relicsPerCycle;
        this._inSceneGui = new InSceneStuctureGUI('TavernSceneGui', this, 'Relics');
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
    
            this._upgradeLevel += 1;
            this._cycleTime = timeToMakeRelic(this.getUpgradeLevel());
      
            this.notifyObserversOnUpgrade();

            this._upgradeCostFarmers = tavernUpgradeCostFarmers(this.getUpgradeLevel());
            this._upgradeCostGold = Math.round(tavernUpgradeCostGold(this.getUpgradeLevel())*1000)/1000;

        }
    }   
}