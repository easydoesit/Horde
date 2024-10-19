import { StructureStateChildI } from "../../typings";
import { InSceneStuctureGUI } from "../GUI/inSceneStructureGUI";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE, farmToThievesGuildPaths, thievesGuildClickBox, thievesGuildModels, thievesGuildPos } from "../utils/CONSTANTS";
import { lootPerCycle, theivesGuildCreateGoldAmount, thievesGuildUpgradeCostFarmers, thievesGuildUpgradeCostGold, thievesGuildUpgradeMax, timeToMakeLoot } from "../utils/MATHCONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { StructureState } from "./structureState";

export class StructureThievesGuild extends StructureState implements StructureStateChildI {
    constructor(scene:PlayMode) {
        super(scene);
        this._name = 'Thieves Guild';
        this._character = 'thief';
        this._animationPaths = farmToThievesGuildPaths;
        this._upgradeMax = thievesGuildUpgradeMax;
        this._upgradeCostGold = Math.round(thievesGuildUpgradeCostGold(this.getUpgradeLevel())*1000/1000);
        this._upgradeCostFarmers = Math.round(thievesGuildUpgradeCostFarmers(this.getUpgradeLevel()));
        this._product = 'Loot';
        this._cycleTime = timeToMakeLoot(this.getUpgradeLevel());
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, thievesGuildModels, thievesGuildClickBox, thievesGuildPos);
        this._goldPerCycle = theivesGuildCreateGoldAmount;
        this._productAmountPerCycle = lootPerCycle;
        this._inSceneGui = new InSceneStuctureGUI('ThievesGuildSceneGui', this, 'Loot');
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
            this._cycleTime = timeToMakeLoot(this.getUpgradeLevel());
      
            //update the observers
            this.notifyObserversOnUpgrade();

            this._upgradeCostFarmers = thievesGuildUpgradeCostFarmers(this.getUpgradeLevel());

            this._upgradeCostGold = Math.round(thievesGuildUpgradeCostGold(this.getUpgradeLevel())*1000)/1000;

        }
    }   
}