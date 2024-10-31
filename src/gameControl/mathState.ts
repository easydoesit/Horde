import { MathStateI, MathStateObserverI, ResourcesT, StructureStateI, StructureStateObserverOnCycleI, StructureStateObserverOnUpgradeI} from "../../typings";
import { farmersMaxPerFarm} from "../utils/CONSTANTS";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE, startingFarmers, startingGold, startingLumens, farmerBaseValue } from "../utils/CONSTANTS";

export class MathState implements MathStateI, StructureStateObserverOnUpgradeI, StructureStateObserverOnCycleI {
    public name:string;
    private _observers:MathStateObserverI[];
    private _scene:PlayMode;

    //farmers
    private _totalFarmers:number;
    private _runningFarmers:number;
    private _farmersMax:number;

    //gold
    private _totalGold:number;
    private _goldPerSecond:number;
    private _goldMultiplyer:number;

    //lumens
    private _totalLumens:number;

    //wheat
    private _wheatValue:number;


    constructor(scene:PlayMode) {
        this.name = "MathState"
        this._scene = scene;
        this._observers = [];

        this._totalFarmers = startingFarmers;
        this._runningFarmers = 0;
        this._farmersMax = 0;
        this.changeFarmersMax();
    
        this._totalGold = startingGold;
        this._goldPerSecond = 0;
        this._goldMultiplyer = 1;

        this._totalLumens = startingLumens;
        
        this._wheatValue = 0;

        //Structures

        for (let i in this._scene.allStructures) {
            this._scene.allStructures[i].attachObserversUpgrade(this);
            this._scene.allStructures[i].attachObserversCycle(this);
        }

        this._scene.onBeforeRenderObservable.add(() => {
            
            this._goldPerSecond = this.changeGoldPerSecond();
            this.changeFinalGold();
            this.notify();
        
        })

    }

    //Observers
    public attach(observer:MathStateObserverI):void {
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

    public detach(observer:MathStateObserverI) {
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
            observer.updateMathState(this);
        }
        
    }

    //Gold
    private changeFinalGold() {    
        
        const goldPerFrame = this.getGoldPerSecond() * (this._scene.getEngine().getDeltaTime()/1000);

        this.addGold(goldPerFrame);
    
    }

    public changeGoldPerSecond() {

        return (1 + this.getWheatValue()) * this._farmerMultiplyByBaseVal(this.getTotalFarmers()) * this.getGoldMultiplyer();

    }

    public getGoldPerSecond(): number {
        return this._goldPerSecond;
    }

    public addGold(amount: number): void {
        this._totalGold  += amount;
    }

    public spendGold(amount:number) {
        
        if (this._totalGold - amount >= 0) {
            this._totalGold -= amount;
        } else {
            this._totalGold = 0;
        }

    }

    public getTotalGold():number {
        return this._totalGold;
    }

    public getGoldMultiplyer(): number {
        return this._goldMultiplyer;
    }

    public changeGoldMultiplyer(changeValue: number):void {
        this._goldMultiplyer = this.getGoldMultiplyer() * changeValue;
    }

    //Lumens
    public addLumens(amount: number): void {
        this._totalLumens  += amount
    }

    public spendLumens(amount:number):void {
       this._totalLumens -= amount;
    }

    public getTotalLumens():number {
        return this._totalLumens;
    }

    //Farmers
    public getTotalFarmers() {
        return this._totalFarmers;
    }

    public addFarmers(number:number) {
       this._totalFarmers += number;
    }

    public spendFarmers(amount:number) {

        if(this._totalFarmers - amount >= 0) {
            this._totalFarmers -= amount;
        } else {
            this._totalFarmers = 0;
        }
    
    }

    private _farmerMultiplyByBaseVal(totalFarmers:number) {
        return totalFarmers * farmerBaseValue;
    }

    public makeFarmerRun(number:number) {
        this._runningFarmers += number;
    }

    public endFarmerRun() {
        this._runningFarmers -= 1;
    }

    public getRunningFarmers() {
        return this._runningFarmers;
    }

    public changeFarmersMax():void {
        let total = 0;

        total += farmersMaxPerFarm(this._scene.farms.getUpgradeLevel());
        
        this._farmersMax = total;
    }

    public getFarmersMax():number {
        return this._farmersMax;
    }

    public getWheatValue(): number {
        return this._wheatValue;
    }

    public changeWheatValue(value: number): void {
        this._wheatValue = value;
    }

    public updateStructureOnUpgrade(structure: StructureStateI): void {
        if (DEBUGMODE) {
            console.log(`updating ${this.name} from ${structure.getName()}`);
        }
        
        //these should go back to the state to spend the money.
        this.spendFarmers(structure.getUpgradeCostFarmers());
        this.spendGold(structure.getUpgradeCostGold());
        const newGoldMultiplyer = this.getGoldMultiplyer() + (this.getGoldMultiplyer() * structure.getGoldMultiplyer()/100);
        this.changeGoldMultiplyer(newGoldMultiplyer);


        if (structure.getName().includes("Farms")){
            this.changeFarmersMax();
        } 

        if (DEBUGMODE) {
            console.log(`New MathState Gold Multiplyer: ${this.getGoldMultiplyer()}`);
        }
    
    }

    public updateStructureOnCycle(resource: ResourcesT, resourceAmountPerCycle: number, goldPerCycle: number): void {
        this.addGold(goldPerCycle);
    }

}