import { StructureStateChildI } from "../../typings";
import { GUIPlay } from "../GUI/GUIPlay";
import { InSceneStuctureGUI } from "../GUI/inSceneStructureGUI";
import { AddStructureButton } from "../GUI/structureUpgrades/addStructureButton";
import { StructureUpgradeSection } from "../GUI/structureUpgrades/structureUpgradeSection";
import { UpgradeWindow } from "../GUI/upgradeWindow";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE, farmToTowerPaths, towerClickBox, towerModels, towerPos  } from "../utils/CONSTANTS";
import { portalsPerCycle, portalUpgradeValue, timeToMakePortal, towerCreateGoldAmount, towerUpgradeCostFarmers, towerUpgradeCostGold, towerUpgradeMax } from "../utils/MATHCONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { structureUpgradeAllowed } from "../utils/upgradeHelpers";
import { StructureState } from "./structureState";

export class StructureTower extends StructureState implements StructureStateChildI {
    constructor(scene:PlayMode) {
        super(scene);
        this._name = 'Tower';
        this._character = 'wizard';
        this._animationPaths = farmToTowerPaths;
        this._upgradeMax = towerUpgradeMax;
        this._upgradeLevel = 0;
        this._upgradeCostGold = Math.round(towerUpgradeCostGold(this.getUpgradeLevel())*1000/1000);
        this._upgradeCostFarmers = Math.round(towerUpgradeCostFarmers(this.getUpgradeLevel()));
        this._product = 'Portals';
        this._cycleTime = timeToMakePortal(this.getUpgradeLevel());
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, towerModels, towerClickBox, towerPos);
        this._goldPerCycle = towerCreateGoldAmount;
        this._productAmountPerCycle = portalsPerCycle;
        this._inSceneGui = new InSceneStuctureGUI('TowerSceneGui', this, 'Portals');
        this._upgradesWindow = new UpgradeWindow('TowerUpgradeWindow');
        this._upgradeSection = new StructureUpgradeSection('TowerUpgradeSection', `Speeds Up Portal Creation by ${portalUpgradeValue * 100}%`, this, () => {this._towerUpgradeCallback()});
        this._addStructureButton = new AddStructureButton('addTowerButton', this, () => {this._towerAdditionCallback()});
        this._addUpgradePanel();

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
            this._cycleTime = timeToMakePortal(this.getUpgradeLevel());
      
            //update the observers
            this.notifyObserversOnUpgrade();

            this._upgradeCostFarmers = towerUpgradeCostFarmers(this.getUpgradeLevel());
            this._upgradeCostGold = Math.round(towerUpgradeCostGold(this.getUpgradeLevel())*1000)/1000;

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