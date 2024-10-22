import { StructureStateChildI } from "../../typings";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { castleToFarmPaths, DEBUGMODE, Farm02Pos, farmClickBox, farmModels } from "../utils/CONSTANTS";
import { farmUpgradeCostGold, farmUpgradeMax } from "../utils/MATHCONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { StructureState } from "./structureState";

export class StructureFarm02 extends StructureState implements StructureStateChildI {
    
    constructor(scene:PlayMode){
        super(scene);
        this._name = 'Farm02';
        this._character = 'farmer';
        this._animationPaths = castleToFarmPaths;
        this._upgradeMax = farmUpgradeMax;
        this._upgradeCostGold = Math.round(farmUpgradeCostGold(this.getUpgradeLevel())*1000/1000);
        this._upgradeCostFarmers = 0;
        this._product = null;
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, farmModels, farmClickBox, Farm02Pos);
        this._upgradesWindow = this._scene.farm01.getUpgradesWindow(); //shared window
    }

    public upgradeState() {
            
        if (DEBUGMODE) {
            debugUpgradeState(this._name, this._upgradeLevel);
        }
        
        if (this.getUpgradeLevel() < this.getUpgradeMax()) {
            //change the structures
            switch(this._upgradeLevel) {
                case 1 :  {
                    this._structureModels.hideModel(0);
                    this._structureModels.showModel(1);
                }
                break;
            }
    
            this._upgradeLevel += 1;

            this.notifyObserversOnUpgrade();

        }

    }
}