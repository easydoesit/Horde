import { StandardUpgradeSection } from "../GUI/standardUpgrades/standardUpgradesSection";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE } from "../utils/CONSTANTS";
import { increaseLootValue } from "../utils/STANDARDUPGRADESCONSTANTS";
import { StandardUpgradeState } from "./standardUpgradesState";
import { StandardUpgradeStateChildI } from "../../typings";


//Increase value upgrade for the thievesGuild
export class IncreaseLootValueState extends StandardUpgradeState implements StandardUpgradeStateChildI {

    constructor(name:string, scene:PlayMode){
        super(name,scene);
        this._maxNumUpgrades = increaseLootValue.upgradeMax;
        this._increment = increaseLootValue.incrementValue;
        this._structure = this._scene.thievesGuild;

        //all of these are updatable
        this._effectValue = increaseLootValue.effectValue(this.getCurrentUpgradeLevel(), this.getMaxNumUpgrades(), this.getIncrement());
        console.log(this._effectValue);
        this._instructions = this._makeInstructions();
        this._upgradeCostGold = increaseLootValue.nextUpgradeCostGold(this.getCurrentUpgradeLevel());
        console.log('thievesGuild UPDATE HERE',this._upgradeCostGold);
        this._upgradeCostFarmers = increaseLootValue.nextUpgradeCostFarmers(this.getCurrentUpgradeLevel());
        this._upgradeCostResources = increaseLootValue.nextUpgradeCostResources(this.getCurrentUpgradeLevel());
        
        //create it's section
        this._upgradeSection = new StandardUpgradeSection(this.name, this, () => {this._increaseThievesValUpgradeCallback()});
        this._scene.thievesGuild.getUpgradesWindow().getPanelContainer().addControl(this._upgradeSection);
        
        this._scene.onBeforeRenderObservable.add(() => {
        
            this._upgradeSection.setUpgradableStatus(this._increaseLootValueUpgradeAllowed());
        
        });

    
    
    }

    public updateState():void {
        if (DEBUGMODE) {
            console.log(`Increase Thieves Value Update State Called`);
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
            console.error('Resources are not available for Increase Thieves Val Upgrade! Change the nextUpgradeCostResources to return 0 or set this line of code in the upgrade State.');
        }

        //update all the properties here
        this._currentUpgradeLevel += 1;
        this._effectValue = increaseLootValue.effectValue(this.getCurrentUpgradeLevel(), this.getMaxNumUpgrades(), this.getIncrement());
        this._upgradeCostGold = increaseLootValue.nextUpgradeCostGold(this._currentUpgradeLevel);
        this._upgradeCostFarmers = increaseLootValue.nextUpgradeCostFarmers(this.getCurrentUpgradeLevel());
        this._upgradeCostResources = increaseLootValue.nextUpgradeCostResources(this.getCurrentUpgradeLevel());
        this._instructions = this._makeInstructions();
        
        //increase the value of Ore
        const origMultiplyer = this._scene.thievesGuild.getResourceMultiplyer();
        const newMultiplyer = origMultiplyer + this.getEffectValue();
        this._scene.thievesGuild.setResourceMultiplyer(newMultiplyer);

        //increase the value of Gold
        const origGoldPerCycle = this._scene.thievesGuild.getGoldPerCycle();
        const newGoldPerCycle = origGoldPerCycle + this.getEffectValue();
        this._scene.thievesGuild.setGoldPerCycle(newGoldPerCycle);
        //notify the observers
        this.notify();

        //update insceneGUI
        this._structure.setResourcePerCycle(this._structure.getResourcePerCycle() + (this._structure.getResourcePerCycle() * this._structure.getResourceMultiplyer()/100))
        this._structure.getInSceneGui().setInfoText(`${this._structure.getResourcePerCycle().toFixed(3)} Thieves/cycle`)

    }

    private _increaseThievesValUpgradeCallback = () => {
        
        if (DEBUGMODE) {
            console.log('Increase Thieves Value Upgrade Callback Called');
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

        private _increaseLootValueUpgradeAllowed() {
        if (this._scene.mathState.getTotalGold() > this.getCostToUpgradeGold() && this._scene.mathState.getTotalFarmers() > this.getCostToUpgradeFarmers()) {
            return true;
        } else {
            return false;
        }
    }


    private _makeInstructions():string {
        const effectValue = increaseLootValue.effectValue(this.getCurrentUpgradeLevel() + 1, this.getMaxNumUpgrades(), this.getIncrement());
        const evString = (effectValue * 100).toFixed(2);
        
        return `Next Upgrade raises amount of gold and Thieves per cycle by ${evString}%`
    }

    public kingdomReset(): void {
        this._currentUpgradeLevel = 0;
        this._effectValue = increaseLootValue.effectValue(this.getCurrentUpgradeLevel(), this.getMaxNumUpgrades(), this.getIncrement());
        this._upgradeCostGold = increaseLootValue.nextUpgradeCostGold(this._currentUpgradeLevel);
        this._upgradeCostFarmers = increaseLootValue.nextUpgradeCostFarmers(this.getCurrentUpgradeLevel());
        this._upgradeCostResources = increaseLootValue.nextUpgradeCostResources(this.getCurrentUpgradeLevel());
        this._instructions = this._makeInstructions();

        this._scene.workShop.setResourceMultiplyer(this.getEffectValue());
        this._scene.workShop.setGoldPerCycle(this.getEffectValue());
        
        this.notify();

        this._structure.getInSceneGui().setInfoText(`${this._structure.getResourcePerCycle().toFixed(3)} Loot/cycle`);

    }
}