import { StructureStateChildI } from "../../typings";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE, farmToWorkShopPaths, workShopClickBox, workShopModels, workShopPos, } from "../utils/CONSTANTS";
import { timeToMakeGoldBar, timeToMakeRelic, workShopCreateGoldAmount, workShopUpgradeCostFarmers, workShopUpgradeCostGold, workShopUpgradeMax } from "../utils/MATHCONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { StructureState } from "./structureState";

export class StructureWorkShop extends StructureState implements StructureStateChildI {
    constructor(name:string, scene:PlayMode) {
        super(name, scene);
        this._character = 'alchemist';
        this._animationPaths = farmToWorkShopPaths;

        this._upgradeMax = workShopUpgradeMax;
        this._upgradeLevel = 0;
        this._upgradeCostGold = Math.round(workShopUpgradeCostGold(this.getUpgradeLevel())*1000/1000);
        this._upgradeCostFarmers = Math.round(workShopUpgradeCostFarmers(this.getUpgradeLevel()));
        this._product = 'Goldbars';
        this._timeToMakeProduct = timeToMakeRelic(this.getUpgradeLevel());
        this._structureModels = new StructureModel(`${this.name}_models`, this._scene, workShopModels, workShopClickBox, workShopPos);
        this._createGoldAmount = workShopCreateGoldAmount;

    }

    public upgradeState(): void {
        
        if (DEBUGMODE) {
            debugUpgradeState(this.name, this.getUpgradeLevel());
        }

        if (this.getUpgradeLevel() < this.getUpgradeMax()) {
            //change the structures
            switch(this.getUpgradeLevel()) {
                case 1 :  {
                    this._structureModels.hideModel(0);
                    this._structureModels.showModel(1);
                }
                break;
            }

            this._animateCharacters();
    
            //update the variables
            //these ones are before the notify
            this._upgradeLevel += 1;
            this._timeToMakeProduct = timeToMakeGoldBar(this.getUpgradeLevel());
      
            //update the observers
            this.notify();

            this._upgradeCostFarmers = workShopUpgradeCostFarmers(this.getUpgradeLevel());

            this._upgradeCostGold = Math.round(workShopUpgradeCostGold(this.getUpgradeLevel())*1000)/1000;

        }
    }   
}