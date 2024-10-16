import { MathStateI, MathStateObserverI, ProductsT, StructureI, StructureObserverI} from "../../typings";
import { farmerBaseValue,farmersMaxPerFarm, startingFarmers,startingGold,startingLumens,wheatUpgradeCostGold, wheatUpgradeValue } from "../utils/MATHCONSTANTS";
import { addFarmersCostLumens, addFarmersMultInit } from "../utils/EPICUPGRADESCONSTANTS";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE } from "../utils/CONSTANTS";

export class MathState implements MathStateI, StructureObserverI {
    public name:string;
    private _observers:MathStateObserverI[];
    private _scene:PlayMode;

    //farmers
    private _totalFarmers:number;
    private _runningFarmers:number;
    public farmersMax:number;
    public farmersNextUpgradeMax:number;
    
    //farmers epic
    private _addFarmersMult:number;

    //gold
    private _totalGold:number;
    private _goldPerSecond:number;

    //lumens
    private _totalLumens:number;

    //wheat
    public wheatValue:number;
    public costOfWheatUpgrade:number;
    public wheatUpgrades:number;

    //ore
    public totalOre:number;
    public costOfOreGold:number;

    //weapons
    public totalWeapons:number;
    public costOfWeaponsGold:number;

    //villages
    public totalVillages:number;
    public costOfVillagesGold:number;

    //loot
    public totalLoot:number;
    public costOfLootGold:number;

    //goldBars
    public totalGoldBars:number;
    public costOfGoldBars:number;

    //portals
    public totalPortals:number;
    public costOfPortals:number;

    //relics
    public totalRelics:number;
    public costOfRelics:number;

    constructor(scene:PlayMode) {
        this.name = "MathState"
        this._scene = scene;
        this._observers = [];

        this._totalFarmers = startingFarmers;
        this._addFarmersMult = addFarmersMultInit;
        this._runningFarmers = 0;
        this.farmersMax = 0;
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
            this._scene.allStructures[i].attach(this);
        }

        ///Products
        //ore
        this.totalOre = 0;

        //weapons
        this.totalWeapons = 0;

        //villages
        this.totalVillages = 0;

        //loot
        this.totalLoot = 0;

        //goldbars
        this.totalGoldBars = 0;
        
        //portals
        this.totalPortals = 0;

        //relics
        this.totalRelics  = 0;

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

        //const frame = this._scene.getEngine().getDeltaTime()/1000;
        
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
        this._totalGold -= amount;
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
        this._totalFarmers -= amount;
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
            total += Math.round(farmersMaxPerFarm(this._scene.farms[i].upgradeLevel));
        }
        
        this.farmersMax = total;
    }

    public getFarmersMax():number {
        return this.farmersMax;
    }

    public increaseAddFarmersMultiplyer(amount:number) {
        
        if(this._addFarmersMult > 1) {
            
            this._addFarmersMult += amount;
        
        } else if (this._addFarmersMult === 1) {

            this._addFarmersMult += amount - 1;
        
        }
    }

    public getFarmersMult() {
        return this._addFarmersMult;
    }

    //products Ore, Weapons, Etc
    public addProduct(product:ProductsT, amount:number) {
        
        switch (product) {
            case 'Ore' : {
                this.totalOre += amount;
            }
            break;

            case 'Weapons' : {
                this.totalWeapons += amount;
            }
            break;

            case 'Villages' : {
                this.totalVillages += amount;
            }
            break;

            case 'Loot': {
                this.totalLoot += amount;
            }
            break;

            case 'Goldbars' : {
                this.totalGoldBars += amount;
            }
            break;
            
            case 'Portals': {
                this.totalPortals += amount;
            }
            break;

            case 'Relics': {
                this.totalRelics  += amount;
            }
            break;

        }

    }

    public removeProduct(product:ProductsT, amount:number) {
        
        switch (product) {
            case 'Ore' : {
                this.totalOre -= amount;
            }
            break;

            case 'Weapons' : {
                this.totalWeapons -= amount;
            }
            break;

            case "Villages": {
                this.totalVillages -= amount;
            }
            break;

            case 'Loot': {
                this.totalLoot -= amount;
            }
            break;

            case 'Goldbars' : {
                this.totalGoldBars -= amount;
            }
            break;
            
            case 'Portals': {
                this.totalPortals -= amount;
            }
            break;

            case 'Relics': {
                this.totalRelics  -= amount;
            }
            break;
        }
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

    public updateStructure(structure: StructureI): void {
        if (DEBUGMODE) {
            console.log(`updating ${this.name} from ${structure.name}`);
            console.log(`Cost of Farmers is ${structure.upgradeCostFarmers}`);
            console.log(`Cost of Gold is ${structure.upgradeCostGold}`);
            console.log(`The Product is $${structure.product}`);
        }

        this._totalFarmers -= Math.round(structure.upgradeCostFarmers);
        this._totalGold -= Math.round(structure.upgradeCostGold * 1000)/1000;

        if (structure.name.includes("Farm")){
            this.changeFarmersMax();
        } 
    }

}