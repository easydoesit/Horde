import { EpicUpgradeStateChildI } from "../../typings";
import { baseGoldPercentInstructions, baseGoldPercentCostLumens, baseGoldPercentStart, baseGoldPercentUpgradeMax, baseGoldPercentValueIncrement, baseGoldPercentBaseCostLumens } from "../utils/EPICUPGRADESCONSTANTS";
import { EpicUpgradeState } from "./epicUpgradeState";

export class BaseGoldPercentUpgradeState extends EpicUpgradeState implements EpicUpgradeStateChildI {

    
    constructor(name:string) {
        super(name);
        this._currentUpgradeLevel = 0;
        this._increment = baseGoldPercentValueIncrement;
        this._currentValue = baseGoldPercentStart;
        this._upgradeNumMax = baseGoldPercentUpgradeMax;
        this._baseCostLumens = baseGoldPercentBaseCostLumens;
        this._instructions = baseGoldPercentInstructions(this._currentUpgradeLevel, this._increment);
        this._costToUpgrade = baseGoldPercentCostLumens(this._currentUpgradeLevel, this._upgradeNumMax, this._baseCostLumens);

    }

    public updateState(): void {

        if (this._currentUpgradeLevel < this._upgradeNumMax) {
            
            this._currentUpgradeLevel += 1;
            this._costToUpgrade = Math.round(baseGoldPercentCostLumens(this._currentUpgradeLevel, this._upgradeNumMax, this._baseCostLumens));
            this._instructions = baseGoldPercentInstructions(this._currentUpgradeLevel, this._increment);
            this._changeValue(); //comes from parent class
            this.notify(); //comes from parent class
        }
        
    }
}