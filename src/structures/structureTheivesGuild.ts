import { StructureStateChildI } from "../../typings";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE, farmToThievesGuildPaths, thievesGuildClickBox, thievesGuildModels, thievesGuildPos } from "../utils/CONSTANTS";
import { theivesGuildCreateGoldAmount, thievesGuildUpgradeCostFarmers, thievesGuildUpgradeCostGold, thievesGuildUpgradeMax, timeToMakeLoot } from "../utils/MATHCONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { StructureState } from "./structureState";

export class StructureTheivesGuild extends StructureState implements StructureStateChildI {
    constructor(name:string, scene:PlayMode) {
        super(name, scene);
        this._character = 'thief';
        this._animationPaths = farmToThievesGuildPaths;

        this._upgradeMax = thievesGuildUpgradeMax;
        this._upgradeLevel = 0;
        this._upgradeCostGold = Math.round(thievesGuildUpgradeCostGold(this.getUpgradeLevel())*1000/1000);
        this._upgradeCostFarmers = Math.round(thievesGuildUpgradeCostFarmers(this.getUpgradeLevel()));
        this._product = 'Loot';
        this._timeToMakeProduct = timeToMakeLoot(this.getUpgradeLevel());
        this._structureModels = new StructureModel(`${this.name}_models`, this._scene, thievesGuildModels, thievesGuildClickBox, thievesGuildPos);
        this._createGoldAmount = theivesGuildCreateGoldAmount;

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
            this._timeToMakeProduct = timeToMakeLoot(this.getUpgradeLevel());
      
            //update the observers
            this.notify();

            this._upgradeCostFarmers = thievesGuildUpgradeCostFarmers(this.getUpgradeLevel());

            this._upgradeCostGold = Math.round(thievesGuildUpgradeCostGold(this.getUpgradeLevel())*1000)/1000;

        }
    }   
}