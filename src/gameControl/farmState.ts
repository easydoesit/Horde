import { farmUpgradeCost, farmersMax, farmUpgradeMax, } from "../utils/MATHCONSTANTS";
import { FarmLand } from "../models_structures/farmLand";
import { FarmStateI, StructureStateObserverI } from "../../typings";
import { GUIPlay } from "../GUI/GUIPlay";

export class FarmState implements FarmStateI{
    public name:string;
    public farmersMax:number;
    public farmUpgradeCost:number;
    public farmersNextMax:number | string | void;
    public gamePieceName:FarmLand['name'];
    public farmUpgradeAllowed: Boolean;
    public upgradeLevel:number;

    private _farmStateObservers:StructureStateObserverI[];
    private _gui:GUIPlay;

    constructor(name: string, gamePieceName:FarmLand['name'], gui:GUIPlay) {
        this.name = name;
        this.upgradeLevel = 0;
        this.farmersMax = Math.round(farmersMax(this.upgradeLevel));
        this.farmersNextMax = this._checkNextUpgrade();
        this.farmUpgradeCost = Math.round(farmUpgradeCost(this.upgradeLevel));
        this.gamePieceName = gamePieceName;

        this._gui = gui;

        this._gui.scene.onBeforeRenderObservable.add(() => {
        
            this.farmUpgradeAllowed = this._checkFarmUpgradeAllowed(this);
        
        })

    }

    public attach(farmStateObserver: StructureStateObserverI): void {
        const observerExists = this._farmStateObservers.includes(farmStateObserver);
        
        if (observerExists) {
            return console.log('StructureStateObserverI has been attached already');
        }

        console.log('FarmState Attached an Observer');
        this._farmStateObservers.push(farmStateObserver);
    
    }

    public detach(farmStateObserver:StructureStateObserverI) {
        const observerIndex = this._farmStateObservers.indexOf(farmStateObserver);

        if (observerIndex === -1) {
            return console.log('No Attached Observer');
        }

        this._farmStateObservers.splice(observerIndex, 1);
        console.log('Detached a GameStateObserverI');
    }

    public notify(): void {
        for(const gameStateObserver of this._farmStateObservers) {
            gameStateObserver.updateUI();
        }
        
    }


    private _checkNextUpgrade():number | string | void {
        let upgradeLevel = null;

        if (this.upgradeLevel < farmUpgradeMax) {
            upgradeLevel = Math.round(farmersMax(this.upgradeLevel + 1))
        } else {
            upgradeLevel = "Maxed out!";
        }

        return upgradeLevel;
    }

    public changeState():void {
        this.upgradeLevel += 1;
        this.farmersMax = Math.round(farmersMax(this.upgradeLevel));
        this.farmersNextMax = this._checkNextUpgrade();
        this.farmUpgradeCost = Math.round(farmUpgradeCost(this.upgradeLevel));
    }

    private _checkFarmUpgradeAllowed(farm:FarmState) {
        //this depends on whether the farm is completely upgraded or not.
        if (this.upgradeLevel < farmUpgradeMax) {
            if (this._gui.scene.mathState.totalGold > farm.farmUpgradeCost) {
                return true;
            } else {
                return false;
            }
        }
    }
    

}