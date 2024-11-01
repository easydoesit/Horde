import { KingdomsI, KingdomsT } from "../../typings";

export class KingdomState implements KingdomsI {
    protected _name:KingdomsT['name'];
    protected _level:KingdomsT['level'];
    protected _costToUnlockGold:KingdomsT['costToUnlockGold'];
    protected _costToUnlockFarmers:KingdomsT['costToUnlockFarmers'];
    protected _costToUnlockResources:KingdomsT['costToUnlockResources'];
    protected _baseGoldBoost:KingdomsT['baseGoldBoost'];
    protected _baseResourceBoost:KingdomsT['baseResourceBoost'];
    protected _prestigeLumens:KingdomsT['prestigeLumens']

    constructor(name:KingdomsT['name']) {
        this._name = name;
    }

    public getName(): KingdomsT["name"] {
        return this._name;
    }

    public getLevel(): KingdomsT["level"] {
        return this._level;
    }

    public getCostToUnlockGold(): KingdomsT["costToUnlockGold"] {
        return this._costToUnlockGold;
    }

    public setCostToUnlockGold(newCost: number): void {
        this._costToUnlockGold = newCost;
    }

    public getCostToUnlockFarmers(): KingdomsT["costToUnlockFarmers"] {
        return this._costToUnlockFarmers;
    }

    public setCostToUnlockFarmers(newCost: number): void {
        this._costToUnlockFarmers = newCost;
    }

    public getCostToUnlockResources(): KingdomsT["costToUnlockResources"] {
        return this._costToUnlockResources;
    }

    public setCostToUnlockResources(newResources: KingdomsT['costToUnlockResources']): void {
        this._costToUnlockResources = newResources;
    }

    public getBaseGoldBoost(): KingdomsT["baseGoldBoost"] {
        return this._baseGoldBoost;
    }

    public setBaseGoldBoost(newValue: number): void {
        this._baseGoldBoost = newValue;
    }

    public getBaseResourceBoost(): KingdomsT["baseResourceBoost"] {
        return this._baseResourceBoost;
    }

    public setBaseResourceBoost(newValue:number): void {
        this._baseResourceBoost = newValue;
    }
    public getPrestigeLumens(): KingdomsT["prestigeLumens"] {
        return this._prestigeLumens
    }

    public setPrestigeLumens(newValue: number): void {
        this._prestigeLumens = newValue;
    }
}