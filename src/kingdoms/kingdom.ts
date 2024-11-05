import { AbstractMesh, TransformNode, Vector3 } from "@babylonjs/core";
import { KingdomI, KingdomsT } from "../../typings";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE, modelsDir } from "../utils/CONSTANTS";

export class Kingdom extends TransformNode implements KingdomI {
    protected _name:KingdomsT['name'];
    protected _level:KingdomsT['level'];
    public scene:PlayMode;
    protected _costToUnlockGold:KingdomsT['costToUnlockGold'];
    protected _costToUnlockFarmers:KingdomsT['costToUnlockFarmers'];
    protected _costToUnlockResources:KingdomsT['costToUnlockResources'];
    protected _baseGoldBoost:KingdomsT['baseGoldBoost'];
    protected _baseResourceBoost:KingdomsT['baseResourceBoost'];
    protected _prestigeLumens:KingdomsT['prestigeLumens'];
    protected _modeldirectory:string;
    protected _importedModels:KingdomsT['importedModels'];
    protected _models:any[];
    protected _hiddenPos:Vector3;

    constructor(name:KingdomsT['name'],scene:PlayMode) {
        super(name);
        this.scene = scene;
        this._modeldirectory = modelsDir;
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

    public getModels():any[] | null {
        return this._models;
    }

    public getHiddenPos(): Vector3 {
        return this._hiddenPos;
    }

    public setEnabled(value: boolean): void {
        console.error(`Override this method.`);
        //this should be overridden
    }


}