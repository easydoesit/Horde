import { StructureStateChildI } from "../../typings";
import { AddStructureButton } from "../GUI/structureUpgrades/addStructureButton";
import { StructureUpgradeSection } from "../GUI/structureUpgrades/structureUpgradeSection";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { castleToFarmPaths, DEBUGMODE, farm04 } from "../utils/CONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { checkUpgradeFarmersMax, farmAdditionAllowed, farmAdditionCallback, farmUpgradeAllowed, farmUpgradeCallBack } from "../utils/upgradeHelpers";
import { StructureState } from "./structureState";

export class StructureFarm04 extends StructureState implements StructureStateChildI {
    
    constructor(scene:PlayMode){
        super(scene);
        this._name = farm04.name;
        this._character = farm04.character;
        this._animationPaths = castleToFarmPaths;
        this._upgradeMax = farm04.upgradeMax;
        this._upgradeCostGold = farm04.nextUpgradeCostInGold(this.getUpgradeLevel());
        this._upgradeCostFarmers = farm04.nextUpgradeCostInFarmers(this.getUpgradeLevel());
        this._upgradeCostResources = farm04.nextUpgradeCostInResources(this.getUpgradeLevel());
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, farm04.models, farm04.clickbox, farm04.gamePos);
        this._upgradesWindow = this._scene.farm01.getUpgradesWindow();//shared Window
        this._upgradeSectionInstructions = `next Upgrade allows ${checkUpgradeFarmersMax(this).toFixed()} farmers on your 4th farm`;
        this._upgradeSection = new StructureUpgradeSection('4th Farm Upgrades', this, () => {farmUpgradeCallBack(this)});
        this._addStructureButton = new AddStructureButton('Farm 4', this, () => {farmAdditionCallback(this, null)});
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
            this._goldMultiplyer = farm04.goldMultiplyer(this.getUpgradeLevel(), this.getUpgradeMax());
            this.changeUpgradeSectionInstructions(`next Upgrade allows ${checkUpgradeFarmersMax(this).toFixed()} farmers on your 4th farm`);

            this.notifyObserversOnUpgrade();

            this._upgradeCostGold = farm04.nextUpgradeCostInGold(this._upgradeLevel);
            this._upgradeCostFarmers = farm04.nextUpgradeCostInFarmers(this.getUpgradeLevel());
            this._upgradeCostResources = farm04.nextUpgradeCostInResources(this.getUpgradeLevel());

        }   

    }
    
}