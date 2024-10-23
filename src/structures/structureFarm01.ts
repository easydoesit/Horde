import { StructureStateChildI } from "../../typings";
import { StructureUpgradeSection } from "../GUI/structureUpgrades/structureUpgradeSection";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { castleToFarmPaths, DEBUGMODE, Farm01Pos, farmClickBox, farmModels } from "../utils/CONSTANTS";
import { farmUpgradeCostGold, farmUpgradeMax } from "../utils/MATHCONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { StructureState } from "./structureState";
import { checkUpgradeFarmersMax, farmUpgradeCallBack, farmUpgradeAllowed } from "../utils/upgradeHelpers";
import { FarmUpgradeWindow } from "../GUI/farmUpgrades/farmUpgradeWindow";

export class StructureFarm01 extends StructureState implements StructureStateChildI {
    
    constructor(scene:PlayMode){
        super(scene);
        this._name = 'Farm01';
        this._character = 'farmer';
        this._animationPaths = castleToFarmPaths;
        this._upgradeMax = farmUpgradeMax;
        this._upgradeCostGold = Math.round(farmUpgradeCostGold(this.getUpgradeLevel())*1000/1000);
        this._upgradeCostFarmers = 0;
        this._product = null;
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, farmModels, farmClickBox, Farm01Pos);
        this._upgradesWindow = new FarmUpgradeWindow(`Farm Upgrades`, this._scene);
        this._upgradeSection = new StructureUpgradeSection('1st Farm Upgrades', `next Upgrade allows ${checkUpgradeFarmersMax(this)} farmers on your 1st farm`, this, () => {farmUpgradeCallBack(this)})
        this._addStructureButton = null;
        this._addUpgradePanel();

        console.log('upgradeSectionFarm1', this._upgradeSection);
        this._scene.onBeforeRenderObservable.add(() => {
        
            this.getUpgradeSection().upgradeAble = farmUpgradeAllowed(this);
        
        })
        
    }

    public upgradeState() {
            
        if (DEBUGMODE) {
            debugUpgradeState(this._name, this.getUpgradeLevel());
        }

        if (this.getUpgradeLevel() < this.getUpgradeMax()) {
            //change the structures
            switch(this._upgradeLevel) {
                case 1 :  {
                    this._structureModels.hideModel(0);
                    this._structureModels.showModel(1);
                }
                break;
            }

            this._upgradeLevel += 1;

            this.notifyObserversOnUpgrade();

            this.getUpgradeSection().instruction = `Next upgrade allows ${checkUpgradeFarmersMax(this)} farmers on your 1st farm`
            this.getUpgradeSection().textBlockUpgradeInstruction.text = this.getUpgradeSection().instruction;

            this._upgradeCostGold = Math.round(farmUpgradeCostGold(this.getUpgradeLevel())*1000)/1000;
            
        }
    
    }
    
}