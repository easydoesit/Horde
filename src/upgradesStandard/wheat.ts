import { StandardUpgradeState } from "./standardUpgradesState";
import { wheat } from "../utils/STANDARDUPGRADESCONSTANTS";
import { PlayMode } from "../scenes/playmode";
import { StandardUpgradeStateChildI } from "../../typings";
import { DEBUGMODE } from "../utils/CONSTANTS";
import { StandardUpgradeSection } from "../GUI/standardUpgrades/standardUpgradesSection";

export class WheatState extends StandardUpgradeState implements StandardUpgradeStateChildI {

    constructor(name:string, scene:PlayMode){
        super(name, scene);
        this._maxNumUpgrades = wheat.upgradeMax;
        this._increment= wheat.incrementValue;
        this._structure = this._scene.farms ;
        
        //all of these are updatable
        this._effectValue = wheat.effectValue(this.getCurrentUpgradeLevel(), this.getMaxNumUpgrades(), this.getIncrement());
        this._instructions = this._makeInstructions();
        this._upgradeCostGold = wheat.nextUpgradeCostGold(this.getCurrentUpgradeLevel());
        this._upgradeCostFarmers = wheat.nextUpgradeCostFarmers(this.getCurrentUpgradeLevel());
        this._upgradeCostResources = wheat.nextUpgradeCostResources(this.getCurrentUpgradeLevel());
        
        //create it's section
        this._upgradeSection = new StandardUpgradeSection(this.name, this, () => {this._wheatUpgradeCallback()});
        this.getStructure().getUpgradesWindow().getPanelContainer().addControl(this._upgradeSection);
    
        this._scene.onBeforeRenderObservable.add(() => {
        
            this._upgradeSection.changeUpgradableStatus(this._wheatUpgradeAllowed());
        
        });

    }

    public updateState(): void {
        if (DEBUGMODE) {
            console.log(`wheat Update State Called`);
        }

        //spend Gold
        if (this.getCostToUpgradeGold() > 0) {
            this._scene.mathState.spendGold(this.getCostToUpgradeGold());
        }
        //spend Farmers
        if (this.getCostToUpgradeFarmers() > 0) {
            console.error('Farmers are not available for Wheat Upgrade! Change the nextUpgradeCostFarmers to return 0 or change this line of code in the upgrade State.');
        }
        //spend Resources
        if (this.getCostToUpgradeResources() > 0) {
            console.error('Resources are not available for Wheat Upgrade! Change the nextUpgradeCostResources to return 0 or change this line of code in the upgrade State.');
        }
        
        //update all the properties here
        this._currentUpgradeLevel += 1;
        this._effectValue = wheat.effectValue(this.getCurrentUpgradeLevel(), this.getMaxNumUpgrades(), this.getIncrement());
        this._upgradeCostGold = wheat.nextUpgradeCostGold(this._currentUpgradeLevel);
        this._upgradeCostFarmers = wheat.nextUpgradeCostFarmers(this.getCurrentUpgradeLevel());
        this._upgradeCostResources = wheat.nextUpgradeCostResources(this.getCurrentUpgradeLevel());
        this._instructions = this._makeInstructions(); 

        //increase the value of wheat
        this._scene.mathState.changeWheatValue(this.getEffectValue());

        //notify the observers
        this.notify();
        
    }

    private _wheatUpgradeCallback = () => {
        
        if (DEBUGMODE) {
            console.log('Wheat Upgrade Callback Called');
        }
        
        if (this.getCurrentUpgradeLevel() < this.getMaxNumUpgrades()) {
            
            if (this._scene.mathState.getTotalGold() >= this.getCostToUpgradeGold() && this._scene.mathState.getTotalFarmers() >= this.getCostToUpgradeFarmers() ) {
                
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

        private _wheatUpgradeAllowed() {
        if (this._scene.mathState.getTotalGold() > this.getCostToUpgradeGold()) {
            return true;
        } else {
            return false;
        }
    }

    private _makeInstructions():string {
        const effectValue = wheat.effectValue(this.getCurrentUpgradeLevel() + 1, this.getMaxNumUpgrades(), this.getIncrement()) * 100;
        const evString = effectValue.toFixed(2);

        return `Next Upgrade raises amount of gold per farmer by ${evString}%`
    }

}