import { EpicUpgradeStateChildI } from "../../typings";
import { PlayMode } from "../scenes/playmode";
import { baseGoldPercentInstructions, baseGoldPercentCostLumens, baseGoldPercentStart, baseGoldPercentUpgradeMax, baseGoldPercentValueIncrement, baseGoldPercentBaseCostLumens } from "../utils/EPICUPGRADESCONSTANTS";
import { EpicUpgradeState } from "./epicUpgradeState";

export class BaseGoldPercentUpgradeState extends EpicUpgradeState implements EpicUpgradeStateChildI {
    private _scene:PlayMode

    constructor(name:string, scene:PlayMode) {
        super(name);
        this._currentUpgradeLevel = 0;
        this._increment = baseGoldPercentValueIncrement;
        this._currentValue = baseGoldPercentStart;
        this._upgradeNumMax = baseGoldPercentUpgradeMax;
        this._baseCostLumens = baseGoldPercentBaseCostLumens;
        this._instructions = baseGoldPercentInstructions(this._currentUpgradeLevel, this._increment);
        this._costToUpgrade = baseGoldPercentCostLumens(this._currentUpgradeLevel, this._upgradeNumMax, this._baseCostLumens);
        this._scene = scene;        
    
    }

    public updateState(): void {

        if (this._currentUpgradeLevel < this._upgradeNumMax) {
            
            this._currentUpgradeLevel += 1;
            this._costToUpgrade = Math.round(baseGoldPercentCostLumens(this._currentUpgradeLevel, this._upgradeNumMax, this._baseCostLumens));
            this._instructions = baseGoldPercentInstructions(this._currentUpgradeLevel, this._increment);
            this._changeValue(); //comes from parent class
            this._updateStructures();
            this.notify(); //comes from parent class
        }
    }

    private _updateStructures() {
        const structures = this._scene.allStructures;

        for (let i in structures) {
            
            if (!structures[i].getName().includes('Farm')) { 
                const currentAmount = structures[i].getGoldPerCycle();
                const newAmount = this._currentValue * currentAmount;

                structures[i].changeGoldPerCycle(newAmount);
            
            }
        }
    }


}