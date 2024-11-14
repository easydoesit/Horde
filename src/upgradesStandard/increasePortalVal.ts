import { StandardUpgradeSection } from "../GUI/standardUpgrades/standardUpgradesSection";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE } from "../utils/CONSTANTS";
import { increasePortalValue } from "../utils/STANDARDUPGRADESCONSTANTS";
import { StandardUpgradeState } from "./standardUpgradesState";
import { StandardUpgradeStateChildI } from "../../typings";


//Increase value upgrade for the Tower
export class IncreasePortalValueState extends StandardUpgradeState implements StandardUpgradeStateChildI {

    constructor(name:string, scene:PlayMode){
        super(name,scene);
        this._maxNumUpgrades = increasePortalValue.upgradeMax;
        this._increment = increasePortalValue.incrementValue;
        this._structure = this._scene.tower;

        //all of these are updatable
        this._effectValue = increasePortalValue.effectValue(this.getCurrentUpgradeLevel(), this.getMaxNumUpgrades(), this.getIncrement());
        console.log(this._effectValue);
        this._instructions = this._makeInstructions();
        this._upgradeCostGold = increasePortalValue.nextUpgradeCostGold(this.getCurrentUpgradeLevel());
        console.log('Tower UPDATE HERE',this._upgradeCostGold);
        this._upgradeCostFarmers = increasePortalValue.nextUpgradeCostFarmers(this.getCurrentUpgradeLevel());
        this._upgradeCostResources = increasePortalValue.nextUpgradeCostResources(this.getCurrentUpgradeLevel());
        
        //create it's section
        this._upgradeSection = new StandardUpgradeSection(this.name, this, () => {this._increaseTowerValUpgradeCallback()});
        this._scene.tower.getUpgradesWindow().getPanelContainer().addControl(this._upgradeSection);
        
        this._scene.onBeforeRenderObservable.add(() => {
        
            this._upgradeSection.setUpgradableStatus(this._increasePortalValueUpgradeAllowed());
        
        });

    
    
    }

    public updateState():void {
        if (DEBUGMODE) {
            console.log(`Increase Tower Value Update State Called`);
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
            console.error('Resources are not available for Increase Tower Val Upgrade! Change the nextUpgradeCostResources to return 0 or set this line of code in the upgrade State.');
        }

        //update all the properties here
        this._currentUpgradeLevel += 1;
        this._effectValue = increasePortalValue.effectValue(this.getCurrentUpgradeLevel(), this.getMaxNumUpgrades(), this.getIncrement());
        this._upgradeCostGold = increasePortalValue.nextUpgradeCostGold(this._currentUpgradeLevel);
        this._upgradeCostFarmers = increasePortalValue.nextUpgradeCostFarmers(this.getCurrentUpgradeLevel());
        this._upgradeCostResources = increasePortalValue.nextUpgradeCostResources(this.getCurrentUpgradeLevel());
        this._instructions = this._makeInstructions();
        
        //increase the value of Ore
        const origMultiplyer = this._scene.tower.getResourceMultiplyer();
        const newMultiplyer = origMultiplyer + this.getEffectValue();
        this._scene.tower.setResourceMultiplyer(newMultiplyer);

        //increase the value of Gold
        const origGoldPerCycle = this._scene.tower.getGoldPerCycle();
        const newGoldPerCycle = origGoldPerCycle + this.getEffectValue();
        this._scene.tower.setGoldPerCycle(newGoldPerCycle);
        //notify the observers
        this.notify();

        //update insceneGUI
        this._structure.setResourcePerCycle(this._structure.getResourcePerCycle() + (this._structure.getResourcePerCycle() * this._structure.getResourceMultiplyer()/100))
        this._structure.getInSceneGui().setInfoText(`${this._structure.getResourcePerCycle().toFixed(3)} Tower/cycle`)

    }

    private _increaseTowerValUpgradeCallback = () => {
        
        if (DEBUGMODE) {
            console.log('Increase Tower Value Upgrade Callback Called');
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

        private _increasePortalValueUpgradeAllowed() {
        if (this._scene.mathState.getTotalGold() > this.getCostToUpgradeGold() && this._scene.mathState.getTotalFarmers() > this.getCostToUpgradeFarmers()) {
            return true;
        } else {
            return false;
        }
    }


    private _makeInstructions():string {
        const effectValue = increasePortalValue.effectValue(this.getCurrentUpgradeLevel() + 1, this.getMaxNumUpgrades(), this.getIncrement());
        const evString = (effectValue * 100).toFixed(2);
        
        return `Next Upgrade raises amount of gold and Tower per cycle by ${evString}%`
    }
}