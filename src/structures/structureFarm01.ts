import { StructureStateChildI } from "../../typings";
import { StructureUpgradeSection } from "../GUI/structureUpgrades/structureUpgradeSection";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { castleToFarmPaths, DEBUGMODE, farm01} from "../utils/CONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { StructureState } from "./structureState";
import { checkUpgradeFarmersMax, farmUpgradeCallBack, farmUpgradeAllowed } from "../utils/upgradeHelpers";
import { FarmUpgradeWindow } from "../GUI/farmUpgrades/farmUpgradeWindow";

export class StructureFarm01 extends StructureState implements StructureStateChildI {

    constructor(scene:PlayMode){
        super(scene);
        this._name = farm01.name;
        this._character = farm01.character;
        this._animationPaths = castleToFarmPaths;
        this._upgradeMax = farm01.upgradeMax;
        this._upgradeCostGold = farm01.nextUpgradeCostInGold(this.getUpgradeLevel());
        this._upgradeCostFarmers = farm01.nextUpgradeCostInFarmers(this.getUpgradeLevel());
        this._upgradeCostResources = farm01.nextUpgradeCostInResources(this.getUpgradeLevel());
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, farm01.models, farm01.clickbox, farm01.gamePos);
        this._upgradesWindow = new FarmUpgradeWindow(`Farm Upgrades`, this._scene);
        this._upgradeSectionInstructions = `next Upgrade allows ${checkUpgradeFarmersMax(this).toFixed()} farmers on your 1st farm`;
        this._upgradeSection = new StructureUpgradeSection('1st Farm Upgrades', this, () => {farmUpgradeCallBack(this)})
        this._addStructureButton = null;
        this._addUpgradePanel();
        
        this._moveStructuresToGamePosition();

        this._scene.onBeforeRenderObservable.add(() => {
        
            this.getUpgradeSection().upgradeAble = farmUpgradeAllowed(this);
        
        });

        this.upgradeState();
        this.getUpgradeSection().changeGoldCost(this._upgradeCostGold);
        
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
            this._goldMultiplyer = farm01.goldMultiplyer(this.getUpgradeLevel(), this.getUpgradeMax());
            this.changeUpgradeSectionInstructions(`Next upgrade allows ${checkUpgradeFarmersMax(this).toFixed()} farmers on your 1st farm`);

            this.notifyObserversOnUpgrade();

            this._upgradeCostGold = farm01.nextUpgradeCostInGold(this._upgradeLevel);
            this._upgradeCostFarmers = farm01.nextUpgradeCostInFarmers(this.getUpgradeLevel());
            this._upgradeCostResources = farm01.nextUpgradeCostInResources(this.getUpgradeLevel());
            
        }
    
    }
    
}