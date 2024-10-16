import { EpicUpgradeI, EpicUpgradeObserverI, MathStateI, MathStateObserverI, ProductsT, StructureI, StructureObserverI} from "../../typings";
import { farmerBaseValue,farmersMaxPerFarm, startingFarmers,startingGold,startingLumens,wheatUpgradeCostGold, wheatUpgradeValue } from "../utils/MATHCONSTANTS";
import { addFarmersCostLumens, addFarmersMultInit } from "../utils/EPICUPGRADESCONSTANTS";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE } from "../utils/CONSTANTS";

export class MathState implements MathStateI, StructureObserverI{
    public name:string;
    private _observers:MathStateObserverI[];
    private _scene:PlayMode;

    //farmers
    private _totalFarmers:number;
    private _runningFarmers:number;
    private _farmersMax:number;
    private _farmersNextUpgradeMax:number;
    
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
    private _totalOre:number;
    private _costOfOreGold:number;

    //weapons
    private _totalWeapons:number;
    private _costOfWeaponsGold:number;

    //villages
    private _totalVillages:number;
    private _costOfVillagesGold:number;

    //loot
    private _totalLoot:number;
    private _costOfLootGold:number;

    //goldBars
    private _totalGoldBars:number;
    private _costOfGoldBars:number;

    //portals
    private _totalPortals:number;
    private _costOfPortals:number;

    //relics
    private _totalRelics:number;
    private _costOfRelics:number;

    constructor(scene:PlayMode) {
        this.name = "MathState"
        this._scene = scene;
        this._observers = [];

        this._totalFarmers = startingFarmers;
        this._addFarmersMult = addFarmersMultInit;
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
            this._scene.allStructures[i].attach(this);
        }

        ///Products
        //ore
        this._totalOre = 0;

        //weapons
        this._totalWeapons = 0;

        //villages
        this._totalVillages = 0;

        //loot
        this._totalLoot = 0;

        //goldbars
        this._totalGoldBars = 0;
        
        //portals
        this._totalPortals = 0;

        //relics
        this._totalRelics  = 0;

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
        
        this._farmersMax = total;
    }

    public getFarmersMax():number {
        return this._farmersMax;
    }

    //products Ore, Weapons, Etc
    public addProduct(product:ProductsT, amount:number) {
        
        switch (product) {
            case 'Ore' : {
                this._totalOre += amount;
            }
            break;

            case 'Weapons' : {
                this._totalWeapons += amount;
            }
            break;

            case 'Villages' : {
            this._totalVillages += amount;
            }
            break;

            case 'Loot': {
            this._totalLoot += amount;
            }
            break;

            case 'Goldbars' : {
            this._totalGoldBars += amount;
            }
            break;
            
            case 'Portals': {
                this._totalPortals += amount;
            }
            break;

            case 'Relics': {
                this._totalRelics  += amount;
            }
            break;

        }

    }

    public removeProduct(product:ProductsT, amount:number) {
        
        switch (product) {
            case 'Ore' : {
                this._totalOre -= amount;
            }
            break;

            case 'Weapons' : {
                this._totalWeapons -= amount;
            }
            break;

            case "Villages": {
            this._totalVillages -= amount;
            }
            break;

            case 'Loot': {
            this._totalLoot -= amount;
            }
            break;

            case 'Goldbars' : {
            this._totalGoldBars -= amount;
            }
            break;
            
            case 'Portals': {
                this._totalPortals -= amount;
            }
            break;

            case 'Relics': {
                this._totalRelics  -= amount;
            }
            break;
        }
    }

    public getTotalProductAmount(product:ProductsT):number {
        
        switch (product) {
            case 'Ore' : {
                return this._totalOre;
            }
            break;

            case 'Weapons' : {
                return this._totalWeapons;
            }
            break;

            case "Villages": {
                return this._totalVillages;
            }
            break;

            case 'Loot': {
                return this._totalLoot;
            }
            break;

            case 'Goldbars' : {
                return this._totalGoldBars;
            }
            break;
            
            case 'Portals': {
                return this._totalPortals;
            }
            break;

            case 'Relics': {
                return this._totalRelics;
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

    public updateEpicUpgrade(upgrade: EpicUpgradeI): void {
        if (DEBUGMODE) {
            console.log(`updating ${this.name} from ${upgrade.name}`)
        }


    }

}