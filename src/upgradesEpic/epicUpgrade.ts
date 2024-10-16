import { EpicUpgradeI, EpicUpgradeObserverI } from "../../typings";
import { DEBUGMODE } from "../utils/CONSTANTS";

export class EpicUpgrade implements EpicUpgradeI{
    public name:string;
    private _observers:EpicUpgradeObserverI[];
    private _costToUpgrade:number;
    private _increment:number;
    private _upgradeNumMax:number;
    private _currentUpgradeLevel:number;
    private _currentValue: number;
    private _costToUpgradeFunc:(currentNumUpgrades:number) => number;

    constructor(name:string, costToUpgrade:(currentNumUpgrades:number) => number, startValue:number, valueIncrement:number, upgradeNumMax:number) {
        //statics
        this.name = name;
        this._observers = [];
        this._costToUpgradeFunc = costToUpgrade;
        this._upgradeNumMax = upgradeNumMax;
        this._increment = valueIncrement;

        //these are the outputs
        this._currentUpgradeLevel = 0;
        this._currentValue = startValue;
        this._costToUpgrade = Math.round(this._costToUpgradeFunc(this._currentUpgradeLevel));
    }

     //Observers
     public attach(observer: EpicUpgradeObserverI): void {
        const observerExists = this._observers.includes(observer);

        if(observerExists) {
            if (DEBUGMODE) {
                return console.log(`${this.name} ${observer.name} has been attached already`);
            }
        }

        this._observers.push(observer);
        
        if (DEBUGMODE) {
            console.log(`${this.name} attached ${observer.name}`);
        }
    }

    public detach(observer:EpicUpgradeObserverI):void {
        const observerIndex = this._observers.indexOf(observer);

        if (observerIndex === -1) {
            if (DEBUGMODE) {
                return console.log(`No ${observer.name} on ${this.name}`);
            }
            return;
        }
        
        this._observers.splice(observerIndex, 1);

        if (DEBUGMODE) {
            console.log(`Detached ${observer.name} from ${this.name}`);
        }
    }

    public notify(): void {
        for(const observer of this._observers) {
            observer.updateEpicUpgrade(this);
        }
        
    }

    public upgradeState():void {
        if (this._currentUpgradeLevel < this._upgradeNumMax) {
            
            this._currentUpgradeLevel += 1;
            this._costToUpgrade = Math.round(this._costToUpgradeFunc(this._currentUpgradeLevel));
            this._changeValue();
            this.notify();
        }
    
    }

    public getCurrentUpgradeLevel():number {
        return this._currentUpgradeLevel;
    }


    public getCostToUpgrade():number {
        return this._costToUpgrade;
    }

    private _changeValue():void {
        
        this._currentValue = this._currentUpgradeLevel * this._increment;

    }
    
    public getCurrentValue():number {

        return this._currentValue;
    }

    public getUpgradeNumMax():number {
     
        return this._upgradeNumMax;
    
    }

    public getIncrement():number {
        return this._increment;
    }
}