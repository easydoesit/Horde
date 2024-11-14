import { StandardUpgradeSection } from "../GUI/standardUpgrades/standardUpgradesSection";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE } from "../utils/CONSTANTS";
import { increaseAdventuringSpeed} from "../utils/STANDARDUPGRADESCONSTANTS";
import { StandardUpgradeState } from "./standardUpgradesState";
import { StandardUpgradeStateChildI } from "../../typings";

export class IncreaseAdventuringSpeedState extends StandardUpgradeState implements StandardUpgradeStateChildI {

    constructor(name:string, scene:PlayMode){
        super(name,scene);
        this._maxNumUpgrades = increaseAdventuringSpeed.upgradeMax;
        this._increment = increaseAdventuringSpeed.incrementValue;
        this._structure = this._scene.tavern;

        //all of these are updatable
        this._effectValue = increaseAdventuringSpeed.effectValue(this.getCurrentUpgradeLevel(), this.getMaxNumUpgrades(), this.getIncrement());
        console.log(this._effectValue);
        this._instructions = this._makeInstructions();
        this._upgradeCostGold = increaseAdventuringSpeed.nextUpgradeCostGold(this.getCurrentUpgradeLevel());
        this._upgradeCostFarmers = increaseAdventuringSpeed.nextUpgradeCostFarmers(this.getCurrentUpgradeLevel());
        this._upgradeCostResources = increaseAdventuringSpeed.nextUpgradeCostResources(this.getCurrentUpgradeLevel());
        
        //create it's section
        this._upgradeSection = new StandardUpgradeSection(this.name, this, () => {this._increaseAdventuringSpeedUpgradeCallback()});
        this._scene.tavern.getUpgradesWindow().getPanelContainer().addControl(this._upgradeSection);
        
        this._scene.onBeforeRenderObservable.add(() => {
        
            this._upgradeSection.setUpgradableStatus(this._increaseAdventuringSpeedUpgradeAllowed());
        
        });

    }

    public updateState():void {
        if (DEBUGMODE) {
            console.log(`Increase Tavern Speed Update State Called`);
        }

        //spend Gold
        if (this.getCostToUpgradeGold() > 0) {
            this._scene.mathState.spendGold(this.getCostToUpgradeGold());
        }
        //spend Farmers
        if (this.getCostToUpgradeFarmers() > 0) {
            console.error('Farmers are not available for Increase Weapon Val Upgrade! Change the nextUpgradeCostFarmers to return 0 or set this line of code in the upgrade State.');
        }
        //spend Resources
        if (this.getCostToUpgradeResources() > 0) {
            console.error('Resources are not available for Increase Weapon Val Upgrade! Change the nextUpgradeCostResources to return 0 or set this line of code in the upgrade State.');
        }

        //update all the properties here
        this._currentUpgradeLevel += 1;
        this._effectValue = increaseAdventuringSpeed.effectValue(this.getCurrentUpgradeLevel(), this.getMaxNumUpgrades(), this.getIncrement());
        this._upgradeCostGold = increaseAdventuringSpeed.nextUpgradeCostGold(this._currentUpgradeLevel);
        this._upgradeCostFarmers = increaseAdventuringSpeed.nextUpgradeCostFarmers(this.getCurrentUpgradeLevel());
        this._upgradeCostResources = increaseAdventuringSpeed.nextUpgradeCostResources(this.getCurrentUpgradeLevel());
        this._instructions = this._makeInstructions();
        
        //increase the mining Speed
        const oldCycleTime = this._structure.getResourceCycleTime();
        const newCycleTime = oldCycleTime + (oldCycleTime * this.getEffectValue());
        this._structure.setResourceCycleTime(newCycleTime);

        //notify the observers
        this.notify();

    }

    private _increaseAdventuringSpeedUpgradeCallback = () => {
        
        if (DEBUGMODE) {
            console.log('Increase Tavern Upgrade Callback Called');
        }
        
        if (this.getCurrentUpgradeLevel() < this.getMaxNumUpgrades()) {
            
            if (this._scene.mathState.getTotalGold() > this.getCostToUpgradeGold() && this._scene.mathState.getTotalFarmers() > this.getCostToUpgradeFarmers() ) {
                
                if (this.getResourceSource()) {
                
                    if(this.getResourceSource().getTotalResourceAmount() > this.getCostToUpgradeResources() ) {
                        this.updateState();
                
                    }
                
                } else {
                    this.updateState();
                }

            }
        }
        
    }

        private _increaseAdventuringSpeedUpgradeAllowed() {
        if (this._scene.mathState.getTotalGold() > this.getCostToUpgradeGold() && this._scene.mathState.getTotalFarmers() > this.getCostToUpgradeFarmers()) {
            return true;
        } else {
            return false;
        }
    }


    private _makeInstructions():string {
        const effectValue = increaseAdventuringSpeed.effectValue(this.getCurrentUpgradeLevel() + 1, this.getMaxNumUpgrades(), this.getIncrement());
        const evString = (effectValue * 100).toFixed(2);
        
        return `Next Upgrade Speeds up resource Creation by ${evString}%`
    }
}