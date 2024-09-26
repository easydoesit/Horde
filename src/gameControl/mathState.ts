import { MathStateI, MathStateObserverI} from "../../typings";
import { farmerBaseValue,startingFarmers,startingGold,startingLumens,wheatUpgradeCostGold, wheatUpgradeValue, wheatUpgradesMax } from "../utils/MATHCONSTANTS";
import { PlayMode } from "../scenes/playmode";
import { FarmState } from "./farmState";
import { MineState } from "./mineState";

export class MathState implements MathStateI {
    private _thisName:string;
    private _observers:MathStateObserverI[];
    private _scene:PlayMode;

    //farmers
    public totalFarmers:number;
    public runningFarmers:number;
    public farmersMax:number;
    
    //gold
    public totalGold:number;
    public goldPerSecond:number;

    public totalLumens:number;

    //wheat
    public wheatValue:number;
    public costOfWheat:number;
    public wheatUpgrades:number;

    //farms
    public farmState01:FarmState;
    public farmState02:FarmState;
    public farmState03:FarmState;
    public farmState04:FarmState;
    public farmStates:FarmState[];
    
    //ore
    public totalOre:number;
    public costOfOreGold:number;
    public timeToMakeOre:number;

    //mine
    public mineState:MineState;

    constructor(scene:PlayMode) {
        this._thisName = "MathState"
        this._scene = scene;
        this._observers = [];

        this.totalFarmers = startingFarmers;
        this.runningFarmers = 0;
        this.farmersMax = this.changeFarmersMax();
    
        this.totalGold = startingGold;
        this.goldPerSecond = 0;

        this.totalLumens = startingLumens;
        
        this.wheatValue = 0;
        this.wheatUpgrades = 0;
        this.costOfWheat = Math.round(wheatUpgradeCostGold(this.wheatUpgrades + 1)*1000)/1000;

        //farms
        this.farmState01 = new FarmState('Farm01', 'FarmLand01');
        this.farmState01.changeState();
        this.farmState02 = new FarmState('Farm02', 'FarmLand02');
        this.farmState03 = new FarmState('Farm03', 'FarmLand03');
        this.farmState04 = new FarmState('Farm04', 'FarmLand04');
        this.farmStates = [];
        this.farmStates.push(this.farmState01, this.farmState02, this.farmState03, this.farmState04);

        //ore
        this.totalOre = 0;

        //mine
        this.mineState = new MineState();

        this._scene.onBeforeRenderObservable.add(() => {
            this.goldPerSecond = this.changeGoldPerSecond();
            this.totalGold = this.changeFinalGold();
            this.farmersMax = this.changeFarmersMax();
            this.notify();
        })

    }

    //Observers
    public attach(observer:MathStateObserverI):void {
        const observerExists = this._observers.includes(observer);
        
        if(observerExists) {
            return console.log(`${this._thisName} ObserverI has been attached already`);

        }
        console.log(`${this._thisName} Attached an Observer`);
        this._observers.push(observer);

    }

    public detach(observer:MathStateObserverI) {
        const observerIndex = this._observers.indexOf(observer);

        if (observerIndex === -1) {
            return console.log(`No Attached Observer on ${this._thisName}`);
        }

        this._observers.splice(observerIndex, 1);
        console.log(`Detached a ${this._thisName}ObserverI`);
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
        this.totalLumens -= amount;
    }

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

        for (let i in this.farmStates) {
            total = total + this.farmStates[i].farmersMax;
        }
        
        return total;
    }
    
    //wheat
    public upgradeWheat() {
        this.wheatUpgrades += 1;
    }

    public changeCostOfWheat() {
        this.costOfWheat = Math.round(wheatUpgradeCostGold(this.wheatUpgrades + 1)* 1000)/1000;
    }

    public changeWheatValue() {
        this.wheatValue =  Math.round((this.wheatValue + wheatUpgradeValue)*100)/100;
    }

}