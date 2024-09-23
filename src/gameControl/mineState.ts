import { mineUpgradeCostFarmers, mineUpgradeCostGold, mineUpgradeMax, timeToMakeOre} from "../utils/MATHCONSTANTS";

export class MineState {
    public upgradeCostFarmers:number;
    public upgradeCostGold: number;
    public timeToMakeOre:number;

    public upgradeLevel:number;

    private _onStateChange: ((stateInfo: { speed: number }) => void) | null = null;

    constructor() {
        this.upgradeLevel = 0;
        this.upgradeCostFarmers = Math.round(mineUpgradeCostFarmers(this.upgradeLevel));
        this.upgradeCostGold = Math.round(mineUpgradeCostGold(this.upgradeLevel)*1000)/1000;
        this.timeToMakeOre = timeToMakeOre(this.upgradeLevel);
    }

    public setOnStateChangeCallback(callback: (stateInfo: { speed: number }) => void): void {
        this._onStateChange = callback;
    }

    public changeState() {
        if (this.upgradeLevel < mineUpgradeMax) {
            this.upgradeLevel += 1;
            this.upgradeCostGold = Math.round(mineUpgradeCostGold(this.upgradeLevel)*1000)/1000;
            this.upgradeCostFarmers = Math.round(mineUpgradeCostFarmers(this.upgradeLevel));
            this.timeToMakeOre = timeToMakeOre(this.upgradeLevel);
           
            if (this._onStateChange) {
                this._onStateChange({ speed:this.timeToMakeOre }); // Example: Inverse relationship
            }
        }
    }
}