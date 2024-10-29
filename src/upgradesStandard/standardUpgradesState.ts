import { StandardUpgradeStateI, StandardUpgradeStateObserverI, StructureStateChildI } from "../../typings";
import { StandardUpgradeSection } from "../GUI/standardUpgrades/standardUpgradesSection";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE } from "../utils/CONSTANTS";

export class StandardUpgradeState implements StandardUpgradeStateI {
    public name:string;
    protected _observers:StandardUpgradeStateObserverI[];
    protected _maxNumUpgrades:number;
    protected _increment:number;
    protected _structure:StructureStateChildI;
    protected _upgradeMax:number;
    protected _effectValue:number;
    protected _upgradeCostGold:number;
    protected _upgradeCostFarmers:number;
    protected _upgradeCostResources:number;
    protected _currentUpgradeLevel:number;
    protected _instructions:string;
    protected _scene:PlayMode
    protected _upgradeSection:StandardUpgradeSection;
    protected _resourceSource:StructureStateChildI;

    constructor(name:string, scene:PlayMode){
        this.name = name;
        this._scene = scene;
        this._observers = [];
        this._currentUpgradeLevel = 0;

        //we need to notify the observers that it exists
        this.notify();

    }

      //Observers
      public attach(observer: StandardUpgradeStateObserverI): void {
        const observerExists = this._observers.includes(observer);

        if(observerExists) {
            if (DEBUGMODE) {
                return console.log(`${this.name} ${observer.name} has been attached already`);
            }
        }

        this._observers.push(observer);
        
        if (DEBUGMODE) {
            console.log(`${this.name} Standard Upgrade attached ${observer.name}`);
        }
    }

    public detach(observer:StandardUpgradeStateObserverI):void {
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
            observer.updateStandardUpgrade(this);
        }
        
    }

    public getMaxNumUpgrades():number {     
        return this._maxNumUpgrades;
    }

    public changeMaxNumberUpgrades(value: number): void {
        this._maxNumUpgrades = value;
    }

    public getObservers():StandardUpgradeStateObserverI[]{
        return this._observers;
    }

    public getIncrement(): number {
        return this._increment
    }

    public getCostToUpgradeGold(): number {
        return this._upgradeCostGold;
    }

    public changeCostToUpgradeGold(amount:number):void {
        this._upgradeCostGold = amount;
    }

    public getCostToUpgradeFarmers(): number {
        return this._upgradeCostFarmers;
    }

    public changeCostToUpgradeFarmers(amount:number):void {
        this._upgradeCostFarmers = amount;
    }

    public getCostToUpgradeResources(): number {
        return this._upgradeCostResources;
    }

    public changeCostToUpgradeResources(amount:number):void {
        this._upgradeCostResources = amount;
    }

    public getResourceSource(): StructureStateChildI {
        return this._resourceSource;
    }

    public getInstructions(): string {
        return this._instructions;    
    }

    public changeInstructions(text:string):void {
        this._instructions = text;
    }

    public getCurrentUpgradeLevel(): number {
        return this._currentUpgradeLevel;
    }

    public getEffectValue(): number {
        return this._effectValue;
    }

    public getStructure(): StructureStateChildI {
        return this._structure;
    }
}