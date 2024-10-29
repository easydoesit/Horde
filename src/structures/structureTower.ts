import { StructureStateChildI } from "../../typings";
import { GUIPlay } from "../GUI/GUIPlay";
import { InSceneStuctureGUI } from "../GUI/inSceneStructureGUI";
import { AddStructureButton } from "../GUI/structureUpgrades/addStructureButton";
import { StructureUpgradeSection } from "../GUI/structureUpgrades/structureUpgradeSection";
import { UpgradeWindow } from "../GUI/upgradeWindow";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE, farmToTowerPaths, tower } from "../utils/CONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { structureUpgradeAllowed } from "../utils/upgradeHelpers";
import { StructureState } from "./structureState";

export class StructureTower extends StructureState implements StructureStateChildI {
    constructor(scene:PlayMode) {
        super(scene);
        this._name = tower.name;
        this._character = tower.character;
        this._animationPaths = farmToTowerPaths;
        this._upgradeMax = tower.upgradeMax;
        this._upgradeCostGold = tower.nextUpgradeCostInGold(this.getUpgradeLevel());
        this._upgradeCostFarmers = tower.nextUpgradeCostInFarmers(this.getUpgradeLevel());
        this._upgradeCostResources = tower.nextUpgradeCostInResources(this.getUpgradeLevel());
        this._resource = tower.resource.name;
        this._cycleTime =tower.resource.cycleTime(this._upgradeLevel, tower.resource.initialCycleTime, tower.resource.resourceUpgradeValue);
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, tower.models, tower.clickbox, tower.gamePos);
        this._goldPerCycle = tower.goldPerCycle;
        this._resourceAmountPerCycle = tower.resource.resourcePerCycle;
        this._inSceneGui = new InSceneStuctureGUI('TowerSceneGui', this, `${this._resource}`);
        this._upgradesWindow = new UpgradeWindow('TowerUpgradeWindow');
        this._upgradeSection = new StructureUpgradeSection('TowerUpgradeSection', `Speeds Up ${this._resource} Creation by ${tower.resource.resourceUpgradeValue * 100}%`, this, () => {this._towerUpgradeCallback()});
        this._addStructureButton = new AddStructureButton('addTowerButton', this, () => {this._towerAdditionCallback()});
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
    
            //update the variables
            //these ones are before the notify
            this._upgradeLevel += 1;
            this._cycleTime =tower.resource.cycleTime(this._upgradeLevel, tower.resource.initialCycleTime, tower.resource.resourceUpgradeValue);
      
            //update the observers
            this.notifyObserversOnUpgrade();

            this._upgradeCostGold = tower.nextUpgradeCostInGold(this.getUpgradeLevel());
            this._upgradeCostFarmers = tower.nextUpgradeCostInFarmers(this.getUpgradeLevel());
            this._upgradeCostResources = tower.nextUpgradeCostInResources(this.getUpgradeLevel());

        }
    }   

    private _towerUpgradeCallback() {
        if (DEBUGMODE) {
            console.log('TowerUpgradeChangeCalled');
        }
        
        //upgrade the State
        this.upgradeState();

        this._upgradeSection.changeGoldCost(this.getUpgradeCostGold());
        this._upgradeSection.changeFarmerCost(this.getUpgradeCostFarmers());

    }

    private _towerAdditionCallback() {
        if (DEBUGMODE) {
            console.log('addTowerCalled');
        }
        
        const window = (this._scene.getAppGui() as GUIPlay).getUpgradeWindow('castleUpgradeWindow') as UpgradeWindow;
        window.hideWindow(); 
    }
}