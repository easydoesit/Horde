import { StructureStateChildI } from "../../typings";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { castleToFarmPaths, DEBUGMODE, farm03 } from "../utils/CONSTANTS";
import { StructureState } from "./structureState";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { AddStructureButton } from "../GUI/structureUpgrades/addStructureButton";
import { StructureUpgradeSection } from "../GUI/structureUpgrades/structureUpgradeSection";
import { checkUpgradeFarmersMax, farmAdditionAllowed, farmAdditionCallback, farmUpgradeAllowed, farmUpgradeCallBack } from "../utils/upgradeHelpers";

export class StructureFarm03 extends StructureState implements StructureStateChildI {
    
    constructor(scene:PlayMode){
        super(scene);
        this._name = farm03.name;
        this._character = farm03.character;
        this._animationPaths = castleToFarmPaths;
        this._upgradeMax = farm03.upgradeMax;
        this._upgradeCostGold = farm03.nextUpgradeCostInGold(this.getUpgradeLevel());
        this._upgradeCostFarmers = farm03.nextUpgradeCostInFarmers(this.getUpgradeLevel());
        this._upgradeCostResources = farm03.nextUpgradeCostInResources(this.getUpgradeLevel());
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, farm03.models, farm03.clickbox, farm03.gamePos);
        this._upgradesWindow = this._scene.farm01.getUpgradesWindow();//shared Window
        this._upgradeSectionInstructions = `next Upgrade allows ${checkUpgradeFarmersMax(this).toFixed()} farmers on your 3rd farm`;
        this._upgradeSection = new StructureUpgradeSection('3rd Farm Upgrades', this, () => {farmUpgradeCallBack(this)})
        this._addStructureButton = new AddStructureButton('Farm 3', this, () => {farmAdditionCallback(this, this._scene.farm04.getAddStructureButton())});
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
            debugUpgradeState(this._name, this.getUpgradeLevel());
        }
        
        if (this.getUpgradeLevel() < this._upgradeMax) {
            //change the structures
            switch(this.getUpgradeLevel()) {
                case 1 :  {
                    this._structureModels.hideModel(0);
                    this._structureModels.showModel(1);
                }
                break;
            }

            this._upgradeLevel += 1;
            this._goldMultiplyer = farm03.goldMultiplyer(this.getUpgradeLevel(), this.getUpgradeMax());
            this.changeUpgradeSectionInstructions(`next Upgrade allows ${checkUpgradeFarmersMax(this).toFixed()} farmers on your 3rd farm`);

            this.notifyObserversOnUpgrade();

            this._upgradeCostGold = farm03.nextUpgradeCostInGold(this._upgradeLevel);
            this._upgradeCostFarmers = farm03.nextUpgradeCostInFarmers(this.getUpgradeLevel());
            this._upgradeCostResources = farm03.nextUpgradeCostInResources(this.getUpgradeLevel());


        }

    }

}