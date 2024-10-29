import { StandardUpgradeSection } from "../GUI/standardUpgrades/standardUpgradesSection";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE } from "../utils/CONSTANTS";
import { increaseOreValue } from "../utils/STANDARDUPGRADESCONSTANTS";
import { StandardUpgradeState } from "./standardUpgradesState";
import { StandardUpgradeStateChildI } from "../../typings";

export class IncreaseOreValueState extends StandardUpgradeState implements StandardUpgradeStateChildI {

    constructor(name:string, scene:PlayMode){
        super(name,scene);
        this._maxNumUpgrades = increaseOreValue.upgradeMax;
        this._increment = increaseOreValue.incrementValue;
        this._structure = this._scene.mine;

        //all of these are updatable
        this._effectValue = increaseOreValue.effectValue(this.getCurrentUpgradeLevel(), this.getMaxNumUpgrades(), this.getIncrement());
        console.log(this._effectValue);
        this._instructions = this._makeInstructions();
        this._upgradeCostGold = increaseOreValue.nextUpgradeCostGold(this.getCurrentUpgradeLevel());
        this._upgradeCostFarmers = increaseOreValue.nextUpgradeCostFarmers(this.getCurrentUpgradeLevel());
        this._upgradeCostResources = increaseOreValue.nextUpgradeCostResources(this.getCurrentUpgradeLevel());
        
        //create it's section
        this._upgradeSection = new StandardUpgradeSection(this.name, this, () => {this._increaseOreValUpgradeCallback()});
        this._scene.mine.getUpgradesWindow().getPanelContainer().addControl(this._upgradeSection);
        
        this._scene.onBeforeRenderObservable.add(() => {
        
            this._upgradeSection.changeUpgradableStatus(this._increaseOreValueUpgradeAllowed());
        
        });

    
    
    }

    public updateState():void {
        if (DEBUGMODE) {
            console.log(`Increase Ore Value Update State Called`);
        }

        //spend Gold
        if (this.getCostToUpgradeGold() > 0) {
            this._scene.mathState.spendGold(this.getCostToUpgradeGold());
        }
        //spend Farmers
        if (this.getCostToUpgradeFarmers() > 0) {
            this._scene.mathState.spendFarmers(this.getCostToUpgradeFarmers());
        }
        //spend Resources
        if (this.getCostToUpgradeResources() > 0) {
            console.error('Resources are not available for Increase Ore Val Upgrade! Change the nextUpgradeCostResources to return 0 or change this line of code in the upgrade State.');
        }

        //update all the properties here
        this._currentUpgradeLevel += 1;
        this._effectValue = increaseOreValue.effectValue(this.getCurrentUpgradeLevel(), this.getMaxNumUpgrades(), this.getIncrement());
        this._upgradeCostGold = increaseOreValue.nextUpgradeCostGold(this._currentUpgradeLevel);
        this._upgradeCostFarmers = increaseOreValue.nextUpgradeCostFarmers(this.getCurrentUpgradeLevel());
        this._upgradeCostResources = increaseOreValue.nextUpgradeCostResources(this.getCurrentUpgradeLevel());
        this._instructions = this._makeInstructions();
        
        //increase the value of Ore
        const origMultiplyer = this._scene.mine.getResourceMultiplyer();
        const newMultiplyer = origMultiplyer + this.getEffectValue();
        this._scene.mine.changeResourceMultiplyer(newMultiplyer);

        //increase the value of Gold
        const origGoldPerCycle = this._scene.mine.getGoldPerCycle();
        const newGoldPerCycle = origGoldPerCycle + this.getEffectValue();
        this._scene.mine.changeGoldPerCycle(newGoldPerCycle);
        //notify the observers
        this.notify();

        //update insceneGUI
        this._structure.changeResourcePerCycle(this._structure.getResourcePerCycle() + (this._structure.getResourcePerCycle() * this._structure.getResourceMultiplyer()/100))
        this._structure.getInSceneGui().changeInfoText(`${this._structure.getResourcePerCycle().toFixed(3)} Ore/cycle`)

    }

    private _increaseOreValUpgradeCallback = () => {
        
        if (DEBUGMODE) {
            console.log('Increase Ore Value Upgrade Callback Called');
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

        private _increaseOreValueUpgradeAllowed() {
        if (this._scene.mathState.getTotalGold() > this.getCostToUpgradeGold() && this._scene.mathState.getTotalFarmers() > this.getCostToUpgradeFarmers()) {
            return true;
        } else {
            return false;
        }
    }


    private _makeInstructions():string {
        const effectValue = increaseOreValue.effectValue(this.getCurrentUpgradeLevel() + 1, this.getMaxNumUpgrades(), this.getIncrement());
        const evString = (effectValue * 100).toFixed(2);
        
        return `Next Upgrade raises amount of gold and Ore per cycle by ${evString}%`
    }
}