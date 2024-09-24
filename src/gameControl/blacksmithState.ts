import { blackSmithUpgradeCostFarmers, blackSmithUpgradeCostGold, blackSmithUpgradeMax } from "../utils/MATHCONSTANTS";

export class BlacksmithState {
    public upgradeCostFarmers:number;
    public upgradeCostGold:number;

    public upgradeLevel:number;

    constructor() {
        this.upgradeLevel = 0;
        this.upgradeCostGold = blackSmithUpgradeCostGold(this.upgradeLevel);
        this.upgradeCostFarmers = blackSmithUpgradeCostFarmers(this.upgradeLevel);


    }

    public changeState() {
        if (this.upgradeLevel < blackSmithUpgradeMax) {
            this.upgradeLevel += 1;
            this.upgradeCostGold = blackSmithUpgradeCostGold(this.upgradeLevel);
            this.upgradeCostFarmers = blackSmithUpgradeCostFarmers(this.upgradeLevel);
        }
    }

}