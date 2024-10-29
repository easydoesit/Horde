import { StructureStateChildI } from "../../typings";
import { GUIPlay } from "../GUI/GUIPlay";
import { InSceneStuctureGUI } from "../GUI/inSceneStructureGUI";
import { AddStructureButton } from "../GUI/structureUpgrades/addStructureButton";
import { StructureUpgradeSection } from "../GUI/structureUpgrades/structureUpgradeSection";
import { UpgradeWindow } from "../GUI/upgradeWindow";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE, farmToWorkShopPaths, tower, workShop } from "../utils/CONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { structureUpgradeAllowed } from "../utils/upgradeHelpers";
import { StructureState } from "./structureState";

export class StructureWorkShop extends StructureState implements StructureStateChildI {
    constructor(scene:PlayMode) {
        super(scene);
        this._name = workShop.name;
        this._character = workShop.character;
        this._animationPaths = farmToWorkShopPaths;
        this._upgradeMax = workShop.upgradeMax;
        this._upgradeCostGold = workShop.nextUpgradeCostInGold(this.getUpgradeLevel());
        this._upgradeCostFarmers = workShop.nextUpgradeCostInFarmers(this.getUpgradeLevel());
        this._upgradeCostResources = workShop.nextUpgradeCostInResources(this.getUpgradeLevel());
        this._resource = 'Goldbars';
        this._cycleTime =workShop.resource.cycleTime(this._upgradeLevel, workShop.resource.initialCycleTime, workShop.resource.resourceUpgradeValue);
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, workShop.models, workShop.clickbox, workShop.gamePos);
        this._goldPerCycle = workShop.goldPerCycle;
        this._resourceAmountPerCycle = workShop.resource.resourcePerCycle;
        this._inSceneGui = new InSceneStuctureGUI('WorkShopSceneGui', this, this._resource);
        this._upgradesWindow = new UpgradeWindow('WorkShopUpgradeWindow')
        this._upgradeSection = new StructureUpgradeSection('WorkShopUpgradeSection', `Speeds Up ${this._resource} Creation by ${tower.resource.resourceUpgradeValue * 100}%`, this, () => {this._workShopUpgradeCallback()})
        this._addStructureButton = new AddStructureButton('addWorkShopButton', this, () => {this._workShopAdditionCallback()})
        this._addUpgradePanel();

        this._moveStructuresToGamePosition();

        this._scene.onBeforeRenderObservable.add(() => {

            this.getUpgradeSection().upgradeAble = structureUpgradeAllowed(this);

        })
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
            this._cycleTime =workShop.resource.cycleTime(this._upgradeLevel, workShop.resource.initialCycleTime, workShop.resource.resourceUpgradeValue);
      
            //update the observers
            this.notifyObserversOnUpgrade();

            this._upgradeCostGold = workShop.nextUpgradeCostInGold(this.getUpgradeLevel());
            this._upgradeCostFarmers = workShop.nextUpgradeCostInFarmers(this.getUpgradeLevel());
            this._upgradeCostResources = workShop.nextUpgradeCostInResources(this.getUpgradeLevel());

        }
    }   

    private _workShopUpgradeCallback() {
        if (DEBUGMODE) {
            console.log('WorkShopUpgradeChangeCalled');
        }
        
        //upgrade the State
        this.upgradeState();

        this._upgradeSection.changeGoldCost(this.getUpgradeCostGold());
        this._upgradeSection.changeFarmerCost(this.getUpgradeCostFarmers());

    }

    private _workShopAdditionCallback() {
        if (DEBUGMODE) {
            console.log('addWorkshopCalled');
            
        }   
        const window = (this._scene.getAppGui() as GUIPlay).getUpgradeWindow('castleUpgradeWindow') as UpgradeWindow;
        window.hideWindow(); 
    }
}