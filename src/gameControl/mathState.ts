import { MathStateI, MathStateObserverI, ProductsT, StructureI, StructureObserverI} from "../../typings";
import { farmerBaseValue,farmersMaxPerFarm, startingFarmers,startingGold,startingLumens,wheatUpgradeCostGold, wheatUpgradeValue, wheatUpgradesMax, farmUpgradeMax } from "../utils/MATHCONSTANTS";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE } from "../utils/CONSTANTS";

export class MathState implements MathStateI, StructureObserverI {
    public name:string;
    private _observers:MathStateObserverI[];
    private _scene:PlayMode;

    //farmers
    public totalFarmers:number;
    public runningFarmers:number;
    public farmersMax:number;
    public farmersNextUpgradeMax:number;
    
    //gold
    public totalGold:number;
    public goldPerSecond:number;

    public totalLumens:number;

    //wheat
    public wheatValue:number;
    public costOfWheatUpgrade:number;
    public wheatUpgrades:number;

    //farms
    private _farm01:StructureI;
    private _farm02:StructureI;
    private _farm03:StructureI;
    private _farm04:StructureI;
    //public farms:StructureI[];

    //mine
    private _mine:StructureI;

    //smithy
    private _smithy:StructureI;

    //barracks
    private _barracks:StructureI;
    
    //ore
    public totalOre:number;
    public costOfOreGold:number;
    public timeToMakeOre:number;

    //weapons
    public totalWeapons:number;
    public costOfWeaponsGold:number;
    public timeToMakeWeapons:number;

    //villages
    public totalVillages:number;
    public costOfVillagesGold:number;
    public timeToMakeVillages:number;

    constructor(scene:PlayMode) {
        this.name = "MathState"
        this._scene = scene;
        this._observers = [];

        this.totalFarmers = startingFarmers;
        this.runningFarmers = 0;
        this.farmersMax = 0;
        this.changeFarmersMax();
    
        this.totalGold = startingGold;
        this.goldPerSecond = 0;

        this.totalLumens = startingLumens;
        
        this.wheatValue = 0;
        this.wheatUpgrades = 0;
        this.costOfWheatUpgrade = Math.round(wheatUpgradeCostGold(this.wheatUpgrades + 1)*1000)/1000;

        //Structures
        //farms
        this._farm01 = this._scene.farm01;
        this._farm01.attach(this);
        this._farm02 = this._scene.farm02;
        this._farm02.attach(this);
        this._farm03 = this._scene.farm03;
        this._farm03.attach(this);
        this._farm04 = this._scene.farm04;
        this._farm04.attach(this);

        //mine
        this._mine = this._scene.mine;
        this._mine.attach(this);

        //smithy
        this._smithy = this._scene.smithy;
        this._smithy.attach(this);

        //barracks
        this._barracks = this._scene.barracks;
        this._barracks.attach(this);

        ///Products
        //ore
        this.totalOre = 0;

        //weapons
        this.totalWeapons = 0;

        //villages
        this.totalVillages = 0;

        this._scene.onBeforeRenderObservable.add(() => {
            this.goldPerSecond = this.changeGoldPerSecond();
            this.totalGold = this.changeFinalGold();
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
        
        this.totalGold = this.totalGold + (this.goldPerSecond * (this._scene.getEngine().getDeltaTime()/1000));
            
        let roundedTotalGold = Math.round(this.totalGold * 1000) / 1000;

        return roundedTotalGold;
    
    }

    public changeGoldPerSecond() {

        return Math.round((1 + this.wheatValue) * this._farmerMultiplyer(this.totalFarmers)* 1000) /1000;

    }

    public addGold(amount: number): void {
        this.totalGold  += amount
    }

    public spendGold(amount:number) {
        this.totalGold -= amount;
    }

    //Lumens
    public addLumens(amount: number): void {
        Math.round(this.totalLumens  += amount)
    }

    public spendLumens(amount:number) {
        Math.round(this.totalLumens -= amount);
    }

    //Farmers
    public addFarmers(number:number) {
       this.totalFarmers += number;
    }

    public spendFarmers(amount:number) {
        this.totalFarmers -= amount;
    }

    private _farmerMultiplyer(totalFarmers:number) {
        return Math.round((totalFarmers * farmerBaseValue) * 1000) /1000;
    }

    public makeFarmerRun(number:number) {
        this.runningFarmers += number;
    }

    public endFarmerRun() {
        this.runningFarmers -= 1;
    }

    public changeFarmersMax(){
        let total = 0;

        for (let i in this._scene.farms) {
            total += Math.round(farmersMaxPerFarm(this._scene.farms[i].upgradeLevel));
        }
        
        this.farmersMax  = total;
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

        this.totalFarmers -= Math.round(structure.upgradeCostFarmers);
        this.totalGold -= Math.round(structure.upgradeCostGold * 1000)/1000;

        if (structure.product === 'weapons') {
            this.timeToMakeWeapons = structure.timeToMakeProduct;
        }

        if (structure.name.includes("Farm")){
            this.changeFarmersMax();
        } 
    }

}