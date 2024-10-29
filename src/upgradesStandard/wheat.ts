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
        console.log('wheatUpgradeLevel', this.getCurrentUpgradeLevel());
        this._structure = this._scene.farm01 ;
        
        //all of these are updatable
        this._effectValue = wheat.effectValue(this.getCurrentUpgradeLevel(), this.getMaxNumUpgrades(), this.getIncrement());
        console.log('Wheat Effect Value', this._effectValue);     
        this._instructions = this._makeIntructions();
        this._upgradeCostGold = wheat.nextUpgradeCostGold(this._currentUpgradeLevel);
        this._upgradeCostFarmers = 0;
        this._upgradeCostResources = 0;
        
        //create it's section
        this._upgradeSection = new StandardUpgradeSection(this.name, this, () => this._wheatUpgradeCallback());
        this._scene.farm01.getUpgradesWindow().getPanelContainer().addControl(this._upgradeSection);
    
        this._scene.onBeforeRenderObservable.add(() => {
        
            this._upgradeSection.changeUpgradableStatus(this._wheatUpgradeAllowed());
        
        });

    }

    public updateState(): void {
        if (DEBUGMODE) {
            console.log(`wheat Update State Called`);
        }

        //spend gold
        this._scene.mathState.spendGold(this.getCostToUpgradeGold());

        //update all the properties here
        this._currentUpgradeLevel += 1;
        this._effectValue = wheat.effectValue(this.getCurrentUpgradeLevel(), this.getMaxNumUpgrades(), this.getIncrement());
        this._upgradeCostGold = wheat.nextUpgradeCostGold(this._currentUpgradeLevel);
        this._instructions = this._makeIntructions(); 

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
            
            if (this._scene.mathState.getTotalGold() > this.getCostToUpgradeGold()) {
                this.updateState();
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

    private _makeIntructions():string {
        const effectValue = wheat.effectValue(this.getCurrentUpgradeLevel() + 1, this.getMaxNumUpgrades(), this.getIncrement()) * 100;
        const evString = effectValue.toFixed(2);

        return `Raises amount of gold per farmer by ${evString}%`
    }

}