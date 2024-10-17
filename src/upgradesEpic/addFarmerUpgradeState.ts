import { EpicUpgradeStateChildI } from "../../typings";
import { addFarmersBaseCostLumens, addFarmersCostLumens, addFarmersNumUpgradeMax, addFarmersStartValue, addFarmersUpgradeInstructions, addFarmersValueIncrement } from "../utils/EPICUPGRADESCONSTANTS";
import { EpicUpgradeState } from "./epicUpgradeState";

export class AddFarmerUpgradeState extends EpicUpgradeState implements EpicUpgradeStateChildI {
    constructor(name:string) {
        super(name);
        this._currentUpgradeLevel = 0;
        this._increment = addFarmersValueIncrement;
        this._currentValue = addFarmersStartValue;
        this._upgradeNumMax = addFarmersNumUpgradeMax;
        this._baseCostLumens = addFarmersBaseCostLumens;
        this._instructions = addFarmersUpgradeInstructions(this._currentUpgradeLevel, this._increment);
        this._costToUpgrade = addFarmersCostLumens(this._currentUpgradeLevel, this._upgradeNumMax, this._baseCostLumens);
    
    }

    //update Code goes here

    public updateState(): void {
        
        if (this._currentUpgradeLevel < this._upgradeNumMax) {
            
            this._currentUpgradeLevel += 1;
            this._costToUpgrade = Math.round(addFarmersCostLumens(this._currentUpgradeLevel, this._upgradeNumMax, this._baseCostLumens));
            this._instructions = addFarmersUpgradeInstructions(this._currentUpgradeLevel, this._increment);;
            this._changeValue(); //comes from parent class
            this.notify(); //comes from parent class
        }
    }

}