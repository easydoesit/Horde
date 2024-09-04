import { Scene } from "@babylonjs/core";
import { farmerBaseValue, wheatValue, wheatValueMax } from "../utils/MATHCONSTANTS";

export class MathCycle {
    public farmerCount:number;
    public totalGold:number;
    public totalGoldPerSecond:number;

    constructor() {

        //starting from beginning of the game all numbers are 0.
        this.farmerCount = 0
        this.totalGold = 0;
        this.totalGoldPerSecond = 0;

    }

        public finalMath(scene:Scene) {
            this.totalGold = this.totalGold + (this.totalGoldPerSecond * (scene.getEngine().getDeltaTime()/1000));

            let roundedTotalGold = Math.round(this.totalGold * 1000) /1000;

            this.totalGold = roundedTotalGold;
        }

        public farmerMultiplyer(farmerCount:number) {

            return Math.round((farmerCount * farmerBaseValue) * 1000) /1000;
        
        }

        public wheatMultiplyer(numOfImprovements) {
            const totalRateOfImprovement = numOfImprovements * wheatValue;
    
        }
    


}