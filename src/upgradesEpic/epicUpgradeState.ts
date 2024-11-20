import { EpicUpgradeStateI, EpicUpgradeStateObserverI } from "../../typings";
import { DEBUGMODE } from "../utils/CONSTANTS";

export class EpicUpgradeState implements EpicUpgradeStateI{
    public name:string;
    protected _observers:EpicUpgradeStateObserverI[];
    protected _costToUpgrade:number;
    protected _increment:number;
    protected _upgradeNumMax:number;
    protected _currentUpgradeLevel:number;
    protected _currentValue: number;
    protected _baseCostLumens:number;
    protected _instructions:string;
    protected _active:boolean;

    constructor(name:string) {
        this.name = name;
        this._observers = [];
        this._active = false;
    }

     //Observers
     public attach(observer: EpicUpgradeStateObserverI): void {
        const observerExists = this._observers.includes(observer);

        if(observerExists) {
            if (DEBUGMODE) {
                return console.log(`${this.name} ${observer.name} has been attached already`);
            }
        }

        this._observers.push(observer);
        
        if (DEBUGMODE) {
            console.log(`${this.name} epic Upgrade attached ${observer.name}`);
        }
    }

    public detach(observer:EpicUpgradeStateObserverI):void {
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

    public getCurrentUpgradeLevel():number {
        return this._currentUpgradeLevel;
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

    public getInstructions(): string {
        return this._instructions;
    }

    public getCostToUpgrade():number {
        return this._costToUpgrade;
    }

    protected _setValue():void {   
        this._currentValue = this._currentUpgradeLevel * this._increment;
    }

    public setActive(active:boolean): void {
        this._active = active;
    }

    public getActive(): boolean {
        return this._active;
    }

    public kingdomUpdate(): void {
        if (DEBUGMODE) {
            console.error(`If you are seeing this error then you need to override kindomUpdate() inside ${this.name} epic upgrade`);
        }
    }
}