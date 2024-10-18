import { StructureStateChildI } from "../../typings";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { castleToFarmPaths, DEBUGMODE, Farm03Pos, farmClickBox, farmModels } from "../utils/CONSTANTS";
import { farmUpgradeCostGold, farmUpgradeMax } from "../utils/MATHCONSTANTS";
import { StructureState } from "./structureState";
import { debugUpgradeState } from "../utils/structuresHelpers";

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

        }

    }
}