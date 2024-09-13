import { farmUpgradeCost, farmersMax, farmUpgradeMax } from "../utils/MATHCONSTANTS";
import { FarmLand } from "../models_structures/farmLand";
import { UpgradeSection } from "./upgradeSection";

export class FarmState {
    public name:string;
    public farmersMax:number;
    public farmUpgradeCost:number;
    public farmersNextMax:number | string;
    public gamePieceName:FarmLand['name'];

    public upgradeLevel:number;

    constructor(name: string, gamePieceName:FarmLand['name']) {
        this.name = name;
        this.upgradeLevel = 0;
        this.farmersMax = Math.round(farmersMax(this.upgradeLevel));
        this.farmersNextMax = this._checkNextUpgrade();
        this.farmUpgradeCost = Math.round(farmUpgradeCost(this.upgradeLevel));
        this.gamePieceName = gamePieceName;
    }

    private _checkNextUpgrade() {
        if (this.upgradeLevel < farmUpgradeMax) {
            return Math.round(farmersMax(this.upgradeLevel + 1))
        } else {
            return "Maxed out!"
        }
    }

    public changeState() {
        console.log('changeStateCalled');
        this.upgradeLevel += 1;
        this.farmersMax = Math.round(farmersMax(this.upgradeLevel));
        this.farmersNextMax = this._checkNextUpgrade();
        this.farmUpgradeCost = Math.round(farmUpgradeCost(this.upgradeLevel));
    }

}