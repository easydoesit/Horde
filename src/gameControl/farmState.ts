import { farmUpgradeCost, farmersMax, farmUpgradeMax, } from "../utils/MATHCONSTANTS";
import { StructureModel } from "../models_structures/structureModels";
import { GUIPlay } from "../GUI/GUIPlay";

export class FarmState {
    public name:string;
    public farmersMax:number;
    public farmUpgradeCost:number;
    public farmersNextMax:number | string | void;
    public gamePieceName:StructureModel['name'];
    public farmUpgradeAllowed: Boolean;
    public upgradeLevel:number;

    private _gui:GUIPlay;

    constructor(name: string, gamePieceName:StructureModel['name']) {
        this.name = name;
        this.upgradeLevel = 0;
        this.farmersMax = Math.round(farmersMax(this.upgradeLevel));
        this.farmersNextMax = this._checkNextUpgrade();
        this.farmUpgradeCost = Math.round(farmUpgradeCost(this.upgradeLevel));
        this.gamePieceName = gamePieceName;
    }

    private _checkNextUpgrade():number | string | void {
        let newUpgradeLevel = null;

        if (this.upgradeLevel < farmUpgradeMax) {
            newUpgradeLevel = Math.round(farmersMax(this.upgradeLevel + 1))
        } else {
            newUpgradeLevel = "Maxed out!";
        }

        return newUpgradeLevel;
    }

    public changeState():void {
        this.upgradeLevel += 1;
        this.farmersMax = Math.round(farmersMax(this.upgradeLevel));
        this.farmersNextMax = this._checkNextUpgrade();
        this.farmUpgradeCost = Math.round(farmUpgradeCost(this.upgradeLevel));
    }

}