import { MathStateI, FarmerStateI, FarmerStateObserverI, GoldPerSecondObserverI, MathStateObserverI, GoldStateObserverI, GoldStateI } from "../../typings";
import { farmerBaseValue,startingFarmers,wheatUpgradeCostGold, wheatUpgradeValue, wheatUpgradesMax } from "../utils/MATHCONSTANTS";
import { PlayMode } from "../scenes/playmode";

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

    //wheat
    public wheatValue:number;
    public costOfWheat:number;
    public wheatUpgrades:number;

    constructor(scene:PlayMode) {
        this._thisName = "MathState"
        this._scene = scene;
        this._observers = [];

        this.totalFarmers = startingFarmers;
        this.runningFarmers = 0;
        this.farmersMax = 1000;
        //this.farmersMax = this.finalFarmerMaxMath();

        this.totalGold = 0;
        this.goldPerSecond = 0;
        
        this.wheatValue = 0;
        this.wheatUpgrades = 0;
        this.costOfWheat = Math.round(wheatUpgradeCostGold(this.wheatUpgrades + 1)*1000)/1000;

        this._scene.onBeforeRenderObservable.add(() => {
            this.goldPerSecond = this.changeGoldPerSecond();
            this.totalGold = this._finalGoldMath();
            this.notify();
        })

    }
   
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

    private _finalGoldMath() {
        
        this.totalGold = this.totalGold + (this.goldPerSecond * (this._scene.getEngine().getDeltaTime()/1000));
            
        let roundedTotalGold = Math.round(this.totalGold * 1000) / 1000;

        return roundedTotalGold;
    
    }

    public changeGoldPerSecond() {

        return Math.round((1 + this.wheatValue) * this._farmerMultiplyer(this.totalFarmers)* 1000) /1000;

    }

    public increaseFarmerCount(number:number) {

        this.totalFarmers = this.totalFarmers + number;

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

    public wheatValueChange() {
    
        if (this.wheatValue < wheatUpgradeValue * wheatUpgradesMax) {
            if (this.totalGold > this.costOfWheat) {
            
            //apply the value changes
            this.wheatValue = Math.round((this.wheatValue + wheatUpgradeValue)*100)/100;
            this.goldPerSecond = Math.round(this.changeGoldPerSecond() * 10000)/10000;
            
            //use gold
            this.totalGold = this.totalGold - this.costOfWheat;

            //apply cost change
            this.wheatUpgrades += 1;
            this.costOfWheat = Math.round(wheatUpgradeCostGold(this.wheatUpgrades + 1)* 1000)/1000;
            }

        }
        
    }


    // public finalFarmerMaxMath(){
    //     let total = 0;

    //     for (let i in this.farmStates) {
    //         total = total + this.farmStates[i].farmersMax;
    //     }
        
    //     return total;
    // }
    
}