import { StructureStateChildI } from "../../typings";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { castleToFarmPaths, DEBUGMODE, Farm02Pos, farmClickBox, farmModels } from "../utils/CONSTANTS";
import { farmUpgradeCostGold, farmUpgradeMax } from "../utils/MATHCONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { StructureState } from "./structureState";

export class StructureFarm02 extends StructureState implements StructureStateChildI {
    
    constructor(name:string, scene:PlayMode){
        super(name,scene);
        this._character = 'farmer';
        this._animationPaths = castleToFarmPaths;

        this._upgradeMax = farmUpgradeMax;
        this._upgradeLevel = 0;
        this._upgradeCostGold = Math.round(farmUpgradeCostGold(this.getUpgradeLevel())*1000/1000);
        this._upgradeCostFarmers = 0;
        this._product = null;
        this._timeToMakeProduct = 0;
        this._structureModels = new StructureModel(`${this.name}_models`, this._scene, farmModels, farmClickBox, Farm02Pos);
        this._createGoldAmount = 0;

    }

    public upgradeState() {
            
        if (DEBUGMODE) {
            debugUpgradeState(this.name, this._upgradeLevel);
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

            this._animateCharacters();
    
            //update the variables
            //these ones are before the notify
            this._upgradeLevel += 1;

            //update the observers
            this.notify();

        }

    }
}