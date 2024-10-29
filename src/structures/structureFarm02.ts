import { StructureStateChildI } from "../../typings";
import { AddStructureButton } from "../GUI/structureUpgrades/addStructureButton";
import { StructureUpgradeSection } from "../GUI/structureUpgrades/structureUpgradeSection";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { castleToFarmPaths, DEBUGMODE, farm02 } from "../utils/CONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { checkUpgradeFarmersMax, farmUpgradeAllowed, farmUpgradeCallBack, farmAdditionCallback, farmAdditionAllowed } from "../utils/upgradeHelpers";
import { StructureState } from "./structureState";

export class StructureFarm02 extends StructureState implements StructureStateChildI {
    
    constructor(scene:PlayMode){
        super(scene);
        this._name = farm02.name;
        this._character = farm02.character;
        this._animationPaths = castleToFarmPaths;
        this._upgradeMax = farm02.upgradeMax;
        this._upgradeCostGold = farm02.nextUpgradeCostInGold(this.getUpgradeLevel());
        this._upgradeCostFarmers = farm02.nextUpgradeCostInFarmers(this.getUpgradeLevel());
        this._upgradeCostResources = farm02.nextUpgradeCostInResources(this.getUpgradeLevel());
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, farm02.models, farm02.clickbox, farm02.gamePos);
        this._upgradesWindow = this._scene.farm01.getUpgradesWindow();//shared Window
        this._upgradeSectionInstructions = `next Upgrade allows ${checkUpgradeFarmersMax(this).toFixed()} farmers on your 2nd farm`;
        this._upgradeSection = new StructureUpgradeSection('2nd Farm Upgrades', this, () => {farmUpgradeCallBack(this)})
        this._addStructureButton = new AddStructureButton('Farm 2', this, () => {farmAdditionCallback(this, this._scene.farm03.getAddStructureButton())});
        this._addUpgradePanel();

        this._upgradeSection.isVisible = false;

        this._moveStructuresToGamePosition();

        this._scene.onBeforeRenderObservable.add(() => {
        
            this.getUpgradeSection().upgradeAble = farmUpgradeAllowed(this);
            farmAdditionAllowed(this);
        })
    }

    public upgradeState() {
            
        if (DEBUGMODE) {
            debugUpgradeState(this._name, this._upgradeLevel);
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
            this._goldMultiplyer = farm02.goldMultiplyer(this.getUpgradeLevel(), this.getUpgradeMax());
            this.changeUpgradeSectionInstructions(`next Upgrade allows ${checkUpgradeFarmersMax(this).toFixed()} farmers on your 2nd farm`);

            this.notifyObserversOnUpgrade();
            
            this._upgradeCostGold = farm02.nextUpgradeCostInGold(this._upgradeLevel);
            this._upgradeCostFarmers = farm02.nextUpgradeCostInFarmers(this.getUpgradeLevel());
            this._upgradeCostResources = farm02.nextUpgradeCostInResources(this.getUpgradeLevel());
        
        }

    }

}