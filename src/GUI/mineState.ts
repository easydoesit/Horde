import { mineUpgradeCostFarmers, mineUpgradeCostGold, mineUpgradeMax, costOfOreGold } from "../utils/MATHCONSTANTS";

export class MineState {
    public upgradeCostFarmers:number;
    public upgradeCostGold: number;

    public upgradeLevel:number;

    constructor() {
        this.upgradeLevel = 0;
        
    }

    public changeState() {
        if (this.upgradeLevel < mineUpgradeMax) {
            this.upgradeLevel += 1;
            this.upgradeCostGold = Math.round(mineUpgradeCostGold(this.upgradeLevel)*1000)/1000;
            this.upgradeCostFarmers = Math.round(mineUpgradeCostFarmers(this.upgradeLevel));
            console.log(this.upgradeCostFarmers);
        }
    }
}