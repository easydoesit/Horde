import { StandardUpgradeSection } from "../GUI/standardUpgrades/standardUpgradesSection";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE } from "../utils/CONSTANTS";
import { increaseWeaponsValue } from "../utils/STANDARDUPGRADESCONSTANTS";
import { StandardUpgradeState } from "./standardUpgradesState";
import { StandardUpgradeStateChildI } from "../../typings";

export class IncreaseWeaponsValueState extends StandardUpgradeState implements StandardUpgradeStateChildI {

    constructor(name:string, scene:PlayMode){
        super(name,scene);
        this._maxNumUpgrades = increaseWeaponsValue.upgradeMax;
        this._increment = increaseWeaponsValue.incrementValue;
        this._structure = this._scene.forge;

        //all of these are updatable
        this._effectValue = increaseWeaponsValue.effectValue(this.getCurrentUpgradeLevel(), this.getMaxNumUpgrades(), this.getIncrement());
        this._instructions = this._makeInstructions();
        this._upgradeCostGold = increaseWeaponsValue.nextUpgradeCostGold(this.getCurrentUpgradeLevel());
        this._upgradeCostFarmers = increaseWeaponsValue.nextUpgradeCostFarmers(this.getCurrentUpgradeLevel());
        this._upgradeCostResources = increaseWeaponsValue.nextUpgradeCostResources(this.getCurrentUpgradeLevel());
        
        //create it's section
        this._upgradeSection = new StandardUpgradeSection(this.name, this, () => {this._increaseWeaponsValUpgradeCallback()});
        this._scene.forge.getUpgradesWindow().getPanelContainer().addControl(this._upgradeSection);
        
        this._scene.onBeforeRenderObservable.add(() => {
        
            this._upgradeSection.setUpgradableStatus(this._increaseWeaponsValueUpgradeAllowed());
        
        });

    
    
    }

    public updateState():void {
        if (DEBUGMODE) {
            console.log(`Increase Weapons Value Update State Called`);
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
            console.error('Resources are not available for Increase Weapons Val Upgrade! Change the nextUpgradeCostResources to return 0 or set this line of code in the upgrade State.');
        }

        //update all the properties here
        this._currentUpgradeLevel += 1;
        this._effectValue = increaseWeaponsValue.effectValue(this.getCurrentUpgradeLevel(), this.getMaxNumUpgrades(), this.getIncrement());
        this._upgradeCostGold = increaseWeaponsValue.nextUpgradeCostGold(this._currentUpgradeLevel);
        this._upgradeCostFarmers = increaseWeaponsValue.nextUpgradeCostFarmers(this.getCurrentUpgradeLevel());
        this._upgradeCostResources = increaseWeaponsValue.nextUpgradeCostResources(this.getCurrentUpgradeLevel());
        this._instructions = this._makeInstructions();
        
        //increase the value of Ore
        const origMultiplyer = this._scene.forge.getResourceMultiplyer();
        const newMultiplyer = origMultiplyer + this.getEffectValue();
        this._scene.forge.setResourceMultiplyer(newMultiplyer);

        //increase the value of Gold
        const origGoldPerCycle = this._scene.forge.getGoldPerCycle();
        const newGoldPerCycle = origGoldPerCycle + this.getEffectValue();
        this._scene.forge.setGoldPerCycle(newGoldPerCycle);
        //notify the observers
        this.notify();

        //update insceneGUI
        this._structure.setResourcePerCycle(this._structure.getResourcePerCycle() + (this._structure.getResourcePerCycle() * this._structure.getResourceMultiplyer()/100))
        this._structure.getInSceneGui().setInfoText(`${this._structure.getResourcePerCycle().toFixed(3)} Weapons/cycle`)

    }

    private _increaseWeaponsValUpgradeCallback = () => {
        
        if (DEBUGMODE) {
            console.log('Increase Weapons Value Upgrade Callback Called');
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

        private _increaseWeaponsValueUpgradeAllowed() {
        if (this._scene.mathState.getTotalGold() > this.getCostToUpgradeGold() && this._scene.mathState.getTotalFarmers() > this.getCostToUpgradeFarmers()) {
            return true;
        } else {
            return false;
        }
    }


    private _makeInstructions():string {
        const effectValue = increaseWeaponsValue.effectValue(this.getCurrentUpgradeLevel() + 1, this.getMaxNumUpgrades(), this.getIncrement());
        const evString = (effectValue * 100).toFixed(2);
        
        return `Next Upgrade raises amount of gold and Weapons per cycle by ${evString}%`
    }

    public kingdomReset(): void {
        this._currentUpgradeLevel = 0;
        this._effectValue = increaseWeaponsValue.effectValue(this.getCurrentUpgradeLevel(), this.getMaxNumUpgrades(), this.getIncrement());
        this._upgradeCostGold = increaseWeaponsValue.nextUpgradeCostGold(this._currentUpgradeLevel);
        this._upgradeCostFarmers = increaseWeaponsValue.nextUpgradeCostFarmers(this.getCurrentUpgradeLevel());
        this._upgradeCostResources = increaseWeaponsValue.nextUpgradeCostResources(this.getCurrentUpgradeLevel());
        this._instructions = this._makeInstructions();

        this._scene.workShop.setResourceMultiplyer(this.getEffectValue());
        this._scene.workShop.setGoldPerCycle(this.getEffectValue());
        
        this.notify();

        this._structure.getInSceneGui().setInfoText(`${this._structure.getResourcePerCycle().toFixed(3)} Weapons/cycle`);

    }
}