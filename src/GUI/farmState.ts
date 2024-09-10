import { farmUpgradeCost, farmersMax, farmUpgradeMax } from "../utils/MATHCONSTANTS";

export class FarmState {
    public name:string;
    public farmersMax:number;
    public farmUpgradeCost:number;
    public farmersNextMax:number | string;

    public upgradeLevel:number;

    constructor(name: string) {
        this.name = name;
        this.upgradeLevel = 1;
        this.farmersMax = Math.round(farmersMax(this.upgradeLevel));
        this.farmersNextMax = this._checkNextUpgrade();
        this.farmUpgradeCost = Math.round(farmUpgradeCost(this.upgradeLevel));
    }

    private _checkNextUpgrade() {
        if (this.upgradeLevel < farmUpgradeMax) {
            return Math.round(farmersMax(this.upgradeLevel + 1))
        } else {
            return "Maxed out!"
        }
    }

}