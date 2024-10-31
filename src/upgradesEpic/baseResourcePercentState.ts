import { EpicUpgradeStateChildI } from "../../typings";
import { PlayMode } from "../scenes/playmode";
import { baseResourcePercentBaseCostLumens, baseResourcePercentStart, baseResourcePercentUpgradeMax, baseResourcePercentValueIncrement, baseResourcePercentCostLumens, baseResourcePercentInstructions} from "../utils/EPICUPGRADESCONSTANTS";
import { EpicUpgradeState } from "./epicUpgradeState";

export class BaseResourcePercentUpgradeState extends EpicUpgradeState implements EpicUpgradeStateChildI {
    private _scene:PlayMode

    constructor(name:string, scene:PlayMode) {
        super(name);
        this._currentUpgradeLevel = 0;
        this._increment = baseResourcePercentValueIncrement;
        this._currentValue = baseResourcePercentStart;
        this._upgradeNumMax = baseResourcePercentUpgradeMax;
        this._baseCostLumens = baseResourcePercentBaseCostLumens;
        this._instructions = baseResourcePercentInstructions(this._currentUpgradeLevel, this._increment);
        this._costToUpgrade = baseResourcePercentCostLumens(this._currentUpgradeLevel, this._upgradeNumMax, this._baseCostLumens);
        this._scene = scene;        
    
    }

    public updateState(): void {

        if (this._currentUpgradeLevel < this._upgradeNumMax) {          
            this._currentUpgradeLevel += 1;
            this._costToUpgrade = Math.round(baseResourcePercentCostLumens(this._currentUpgradeLevel, this._upgradeNumMax, this._baseCostLumens));
            this._instructions = baseResourcePercentInstructions(this._currentUpgradeLevel, this._increment);
            this._setValue(); //comes from parent class
            this._updateStructures();
            this.notify(); //comes from parent class
        }

    }

    private _updateStructures() {
        const structures = this._scene.allStructures;

        for (let i in structures) {
            const structure = structures[i];

            if (!structure.getName().includes('Farm')) {
                const currentResourcePerCycleLevel = structure.getResourcePerCycle();
                const newResourcePerCycleLevel = Math.round((currentResourcePerCycleLevel * this._increment)*100)/100;
                
                structure.setResourcePerCycle(newResourcePerCycleLevel);
                structure.getInSceneGui().setInfoText(`${structure.getResourcePerCycle().toFixed(3)} ${structure.getResourceName()}/cycle`)
            }
        }

    }

}