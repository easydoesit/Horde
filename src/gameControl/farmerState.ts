import { FarmerStateI, FarmerStateObserverI } from "../../typings";
import { startingFarmers, farmersMax } from "../utils/MATHCONSTANTS";

export class FarmerState implements FarmerStateI {
    public totalFarmers: number;
    public runningFarmers: number;
    public farmersMax: number;

    private _farmerStateObservers:FarmerStateObserverI[];

    constructor() {
        this.totalFarmers = startingFarmers;
        this.runningFarmers = 0;
        this.farmersMax = 1000;

        this._farmerStateObservers =[];
        
    }

    public attach(farmerStateObserver: FarmerStateObserverI): void {
        const observerExists = this._farmerStateObservers.includes(farmerStateObserver);
        
        if(observerExists) {
            return console.log(`FarmerStateObserverI has been attached already`);

        }
        console.log('FarmerState Attached an Observer');
        this._farmerStateObservers.push(farmerStateObserver);
    }

    public detach(farmerStateObserver: FarmerStateObserverI): void {
        const observerIndex = this._farmerStateObservers.indexOf(farmerStateObserver);

        if (observerIndex === -1) {
            return console.log('No Attached Observer');
        }

        this._farmerStateObservers.splice(observerIndex, 1);
        console.log('Detached a FarmerStateObserverI');
    }

    public notify(): void {
        for(const farmerStateObserver of this._farmerStateObservers) {
            farmerStateObserver.setFarmers(this);
        }
    }

    public increaseFarmerCount(amount:number) {
        return this.totalFarmers = this.totalFarmers + amount;
    }

    public decreaseFarmerCount(amount:number) {
        return this.totalFarmers = this.totalFarmers - amount;
    }

}