import { EpicUpgradeStateChildI } from "../../typings";
import { PlayMode } from "../scenes/playmode";
import { structureFasterCyclesBaseCostLumens, structureFasterCyclesCostLumens, structureFasterCyclesInstructions, structureFasterCyclesStart, structureFasterCyclesUpgradeMax,structureFasterCyclesValueIncrement} from "../utils/EPICUPGRADESCONSTANTS";
import { EpicUpgradeState } from "./epicUpgradeState";

export class StructuresFasterCyclesState extends EpicUpgradeState implements EpicUpgradeStateChildI {
    private _scene:PlayMode

    constructor(name:string, scene:PlayMode) {
        super(name);
        this._scene=scene;
        this._currentUpgradeLevel = 0;
        this._increment = structureFasterCyclesValueIncrement;
        this._currentValue = structureFasterCyclesStart;
        this._upgradeNumMax = structureFasterCyclesUpgradeMax;
        this._baseCostLumens = structureFasterCyclesBaseCostLumens;
        this._instructions = structureFasterCyclesInstructions(this._currentUpgradeLevel, this._increment);
        this._costToUpgrade = structureFasterCyclesCostLumens(this._currentUpgradeLevel, this._upgradeNumMax, this._baseCostLumens);

    }

    public updateState(): void {

        if (this._currentUpgradeLevel < this._upgradeNumMax) {
            this._currentUpgradeLevel +=1;
            this._costToUpgrade  = Math.round(structureFasterCyclesCostLumens(this._currentUpgradeLevel, this._upgradeNumMax, this._baseCostLumens))
            this._instructions = structureFasterCyclesInstructions(this._currentUpgradeLevel, this._increment);
            this._changeValue();
            this._updateStructures();
            this.notify();
        }
    
    }

    private _updateStructures() {
        const structures = this._scene.allStructures;

        for (let i in structures) {
            const structure = structures[i];

            if(!structures[i].getName().includes('Farm')) {
                const currentCycleTime = structure.getProductCycleTime();
                const cycleTime = currentCycleTime * 1.05;
                console.log(cycleTime);
                structure.changeProductCycleTime(cycleTime);

            }
        }
    }

}