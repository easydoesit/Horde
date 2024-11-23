import { StructureStateChildI } from "../../typings";
import { GUIPlay } from "../GUI/GUIPlay";
import { InSceneStuctureGUI } from "../GUI/inSceneStructureGUI";
import { AddStewardButton } from "../GUI/structureUpgrades/addStewardButtons";
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
        this._stewardCost = tower.stewardCost;
        this._initGoldCost = tower.initCosts.gold;
        this._initFarmerCost = tower.initCosts.farmers;
        this._initResourceCost = tower.initCosts.resources;
        this._initResource = tower.initCosts.resourceName;
        this._animationPaths = farmToTowerPaths;
        this._upgradeMax = tower.upgradeMax;
        this._upgradeCostGold = tower.nextUpgradeCostInGold(this.getUpgradeLevel());
        this._upgradeCostFarmers = tower.nextUpgradeCostInFarmers(this.getUpgradeLevel());
        this._upgradeCostResources = tower.nextUpgradeCostInResources(this.getUpgradeLevel());
        this._resource = tower.resource.name;
        this._cycleTime =tower.resource.cycleTime(this._upgradeLevel, tower.resource.initialCycleTime, tower.resource.resourceUpgradeValue(this.getUpgradeLevel(),this.getUpgradeMax()));
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, tower.models, tower.clickbox, tower.gamePos);
        this._goldPerCycle = tower.goldPerCycle;
        this._resourceAmountPerCycle = tower.resource.resourcePerCycle;
        this._inSceneGui = new InSceneStuctureGUI('TowerSceneGui', this, `${this._resource}`);
        this._upgradesWindow = new UpgradeWindow('TowerUpgradeWindow');
        this._upgradeSectionInstructions = `Next Upgrade increases ${this.getResourceName()} by ${( tower.resource.resourceUpgradeValue(this.getUpgradeLevel() + 1,this.getUpgradeMax())).toFixed(2)}% & increases the total Gold multiplyer by ${tower.goldMultiplyer(this.getUpgradeLevel() + 1,this.getUpgradeMax()).toFixed(2)}%`;
        this._upgradeSection = new StructureUpgradeSection('TowerUpgradeSection', this, () => {this._towerUpgradeCallback()});
        this._addStructureButton = new AddStructureButton('addTowerButton', this, () => {this._towerAdditionCallback()});
        this._addStewartButton = new AddStewardButton('StewardButton', this);
        
        this._addUpgradePanel();

        this.moveStructureToStartPosition();

        this._scene.onBeforeRenderObservable.add(() => {

            this.getUpgradeSection().upgradeAble = structureUpgradeAllowed(this);

        })
    }

    public upgradeState(): void {
        
        if (DEBUGMODE) {
            debugUpgradeState(this._name, this.getUpgradeLevel());
        }

        this.animateCharacters();

        this._upgradeLevel += 1;
        this._cycleTime =tower.resource.cycleTime(this._upgradeLevel, tower.resource.initialCycleTime, tower.resource.resourceUpgradeValue(this.getUpgradeLevel(),this.getUpgradeMax()));
        this._goldMultiplyer = tower.goldMultiplyer(this.getUpgradeLevel(),this.getUpgradeMax());
        this.setUpgradeSectionInstructions(`Speeds Up ${this._resource} Creation by ${tower.resource.resourceUpgradeValue(this.getUpgradeLevel(),this.getUpgradeMax()) * 100}%`);

        this._upgradeCostGold = tower.nextUpgradeCostInGold(this.getUpgradeLevel());
        this._upgradeCostFarmers = tower.nextUpgradeCostInFarmers(this.getUpgradeLevel());
        this._upgradeCostResources = tower.nextUpgradeCostInResources(this.getUpgradeLevel());

        this.notifyObserversOnUpgrade();

        this._resourceAmountPerCycle = this.getResourcePerCycle() + (this.getResourcePerCycle() * this.getResourceMultiplyer()/100);

        this.setModels();

    }
    
    private _reset() {
        this._resourceUpgradeValue = tower.resource.resourceUpgradeValue(this.getUpgradeLevel(),this.getUpgradeMax());
        this._cycleTime = tower.resource.cycleTime(this._upgradeLevel, tower.resource.initialCycleTime, this.getResourceUpgradeValue());
        this._goldPerCycle = tower.goldPerCycle;
        this._resourceAmountPerCycle = tower.resource.resourcePerCycle;
        this._goldMultiplyer = tower.goldMultiplyer(this.getUpgradeLevel(),this.getUpgradeMax());
        
        this.setUpgradeSectionInstructions(`Next Upgrade increases ${this.getResourceName()} by ${( tower.resource.resourceUpgradeValue(this.getUpgradeLevel() + 1, this.getUpgradeMax())).toFixed(2)}% & increases the total Gold multiplyer by ${tower.goldMultiplyer(this.getUpgradeLevel() + 1,this.getUpgradeMax()).toFixed(2)}%`);
        
        this._upgradeCostGold = tower.nextUpgradeCostInGold(this.getUpgradeLevel());
        this._upgradeCostFarmers = tower.nextUpgradeCostInFarmers(this.getUpgradeLevel());
        this._resourceMultiplyer = tower.resource.multiplyer(this.getUpgradeLevel(), this.getUpgradeMax());

        this.getInSceneGui().setInfoText(`${this.getResourcePerCycle().toFixed(3)} ${this._resource}/cycle`);

        this.notifyObserversOnUpgrade();

        this.setModels()

        this._upgradeSection.reset();
        this._inSceneGui.reset();

        this.moveStructureToStartPosition();

    }

    private _towerUpgradeCallback() {
        if (DEBUGMODE) {
            console.log('TowerUpgradeChangeCalled');
        }
        
        //upgrade the State
        this.upgradeState();

        this._upgradeSection.setGoldCost(this.getUpgradeCostGold());
        this._upgradeSection.setFarmerCost(this.getUpgradeCostFarmers());
        this.getInSceneGui().setInfoText(`${this.getResourcePerCycle().toFixed(3)} ${this.getResourceName()}/cycle`);
    
    }

    private _towerAdditionCallback() {
        if (DEBUGMODE) {
            console.log('addTowerCalled');
        }
        
        const window = (this._scene.getAppGui() as GUIPlay).getUpgradeWindow('castleUpgradeWindow') as UpgradeWindow;
        window.hideWindow(); 
        this.getInSceneGui().setInfoText(`${this.getResourcePerCycle().toFixed(3)} ${this.getResourceName()}/cycle`);
    
    }

    protected _kingdomResetUnique() {
        //overide in child class as it is for any special changes.
        if (DEBUGMODE) {
            console.log(`Called _kingdomResetUnique() for ${this.getName()} child structure class.`);
        }

        this._reset();
    }

    public setModels(): void {
        
        if (this.getUpgradeLevel() < this.getUpgradeMax()) {
            //set the structures
            switch(this.getUpgradeLevel()) {

                case 0 : {
                    for (let i = 0; i <= this._structureModels.models.length - 1; i++) {
                        this._structureModels.hideModel(i);
                    }
                    this._structureModels.showModel(0);
                }
                break;
                case 1 :  {
                    this._structureModels.hideModel(0);
                    this._structureModels.showModel(1);
                }
                break;

                default: {
                    console.error(`No models for ${this.getName()} at Level ${this.getUpgradeLevel()}. Get the Art Team to work`);
                }
                break;
            }

        }
        
    }

}