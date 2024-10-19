import { StructureStateChildI } from "../../typings";
import { InSceneStuctureGUI } from "../GUI/inSceneStructureGUI";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE, farmToWorkShopPaths, workShopClickBox, workShopModels, workShopPos, } from "../utils/CONSTANTS";
import { goldBarPerCycle, timeToMakeGoldBar, timeToMakeRelic, workShopCreateGoldAmount, workShopUpgradeCostFarmers, workShopUpgradeCostGold, workShopUpgradeMax } from "../utils/MATHCONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { StructureState } from "./structureState";

export class StructureWorkShop extends StructureState implements StructureStateChildI {
    constructor(scene:PlayMode) {
        super(scene);
        this._name = 'Workshop';
        this._character = 'alchemist';
        this._animationPaths = farmToWorkShopPaths;
        this._upgradeMax = workShopUpgradeMax;
        this._upgradeCostGold = Math.round(workShopUpgradeCostGold(this.getUpgradeLevel())*1000/1000);
        this._upgradeCostFarmers = Math.round(workShopUpgradeCostFarmers(this.getUpgradeLevel()));
        this._product = 'Goldbars';
        this._cycleTime = timeToMakeRelic(this.getUpgradeLevel());
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, workShopModels, workShopClickBox, workShopPos);
        this._goldPerCycle = workShopCreateGoldAmount;
        this._productAmountPerCycle = goldBarPerCycle;
        this._inSceneGui = new InSceneStuctureGUI('WorkShopSceneGui', this, 'Goldbars');
    }

    public upgradeState(): void {
        
        if (DEBUGMODE) {
            debugUpgradeState(this._name, this.getUpgradeLevel());
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

            this._upgradeLevel += 1;
            this._cycleTime = timeToMakeGoldBar(this.getUpgradeLevel());
      
            //update the observers
            this.notifyObserversOnUpgrade();

            this._upgradeCostFarmers = workShopUpgradeCostFarmers(this.getUpgradeLevel());

            this._upgradeCostGold = Math.round(workShopUpgradeCostGold(this.getUpgradeLevel())*1000)/1000;

        }
    }   
}