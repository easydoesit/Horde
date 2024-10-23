import { EpicUpgradeStateI, MathStateI, MathStateObserverI, ProductsT, StructureStateI, StructureStateObserverOnCycleI, StructureStateObserverOnUpgradeI} from "../../typings";
import { farmerBaseValue,farmersMaxPerFarm, startingFarmers,startingGold,startingLumens,wheatUpgradeCostGold, wheatUpgradeValue } from "../utils/MATHCONSTANTS";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE } from "../utils/CONSTANTS";

export class MathState implements MathStateI, StructureStateObserverOnUpgradeI, StructureStateObserverOnCycleI{
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

    //lumens
    private _totalLumens:number;

    //wheat
    public wheatValue:number;
    public costOfWheatUpgrade:number;
    public wheatUpgrades:number;

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

        this._totalLumens = startingLumens;
        
        this.wheatValue = 0;
        this.wheatUpgrades = 0;
        this.costOfWheatUpgrade = Math.round(wheatUpgradeCostGold(this.wheatUpgrades + 1)*1000)/1000;

        //Structures
        //farms

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

        return Math.round((1 + this.wheatValue) * this._farmerMultiplyByBaseVal(this._totalFarmers)* 1000) /1000;

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

    //Lumens
    public addLumens(amount: number): void {
        Math.round(this._totalLumens  += amount)
    }

    public spendLumens(amount:number):void {
        Math.round(this._totalLumens -= amount);
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

    private _farmerMultiplyByBaseVal(_totalFarmers:number) {
        return Math.round((_totalFarmers * farmerBaseValue) * 1000) /1000;
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

        for (let i in this._scene.farms) {
            total += Math.round(farmersMaxPerFarm(this._scene.farms[i].getUpgradeLevel()));
        }
        
        this._farmersMax = total;
    }

    public getFarmersMax():number {
        return this._farmersMax;
    }
    
    //wheat
    public upgradeWheat() {
        this.wheatUpgrades += 1;
    }

    public changeCostOfWheatUpgrade() {
        this.costOfWheatUpgrade = Math.round(wheatUpgradeCostGold(this.wheatUpgrades + 1)* 1000)/1000;
    }

    public changeWheatValue() {
        this.wheatValue =  Math.round((this.wheatValue + wheatUpgradeValue)*100)/100;
    }

    public updateStructureOnUpgrade(structure: StructureStateI): void {
        if (DEBUGMODE) {
            console.log(`updating ${this.name} from ${structure.getName()}`);
            console.log(`Cost in Farmers is ${structure.getUpgradeCostFarmers()}`);
            console.log(`Cost in Gold is ${structure.getUpgradeCostGold()}`);
            console.log(`The Product is $${structure.getProductName()}`);
        }

        this.spendFarmers(Math.round(structure.getUpgradeCostFarmers()));
        this.spendGold(Math.round(structure.getUpgradeCostGold() * 1000)/1000);
        // this._totalFarmers -= ;
        // this._totalGold -= Math.round(structure.getUpgradeCostGold() * 1000)/1000;

        if (structure.getName().includes("Farm")){
            console.log('')
            this.changeFarmersMax();
        } 
    }

    public updateStructureOnCycle(product: ProductsT, productAmountPerCycle: number, goldPerCycle: number): void {
        this.addGold(goldPerCycle);
    }

    public updateEpicUpgrade(upgrade: EpicUpgradeStateI): void {
        if (DEBUGMODE) {
            console.log(`updating ${this.name} from ${upgrade.name}`)
        }


    }

}