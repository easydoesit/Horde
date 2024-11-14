import { StructureStateChildI } from "../../typings";
import { GUIPlay } from "../GUI/GUIPlay";
import { InSceneStuctureGUI } from "../GUI/inSceneStructureGUI";
import { AddStewardButton } from "../GUI/structureUpgrades/addStewardButtons";
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
        this._stewardCost = workShop.stewardCost;
        this._initGoldCost = workShop.initCosts.gold;
        this._initFarmerCost = workShop.initCosts.farmers;
        this._initResourceCost = workShop.initCosts.resources;
        this._initResource = workShop.initCosts.resourceName;
        this._animationPaths = farmToWorkShopPaths;
        this._upgradeMax = workShop.upgradeMax;
        this._upgradeCostGold = workShop.nextUpgradeCostInGold(this.getUpgradeLevel());
        this._upgradeCostFarmers = workShop.nextUpgradeCostInFarmers(this.getUpgradeLevel());
        this._upgradeCostResources = workShop.nextUpgradeCostInResources(this.getUpgradeLevel());
        this._resource = 'Goldbars';
        this._cycleTime =workShop.resource.cycleTime(this._upgradeLevel, workShop.resource.initialCycleTime, workShop.resource.resourceUpgradeValue(this.getUpgradeLevel(),this.getUpgradeMax()));
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, workShop.models, workShop.clickbox, workShop.gamePos);
        this._goldPerCycle = workShop.goldPerCycle;
        this._resourceAmountPerCycle = workShop.resource.resourcePerCycle;
        this._inSceneGui = new InSceneStuctureGUI('WorkShopSceneGui', this, this._resource);
        this._upgradesWindow = new UpgradeWindow('WorkShopUpgradeWindow')
        this._upgradeSectionInstructions = `Next Upgrade increases ${this.getResourceName()} by ${( workShop.resource.resourceUpgradeValue(this.getUpgradeLevel() + 1,this.getUpgradeMax())).toFixed(2)}% & increases the total Gold multiplyer by ${workShop.goldMultiplyer(this.getUpgradeLevel() + 1,this.getUpgradeMax()).toFixed(2)}%`;
        this._upgradeSection = new StructureUpgradeSection('WorkShopUpgradeSection', this, () => {this._workShopUpgradeCallback()});
        this._addStructureButton = new AddStructureButton('addWorkShopButton', this, () => {this._workShopAdditionCallback()});
        this._addStewartButton = new AddStewardButton('addWorkshopStewardButton', this);
        this._addUpgradePanel();

        this._moveStructureToStartPosition();

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
        this._cycleTime =workShop.resource.cycleTime(this._upgradeLevel, workShop.resource.initialCycleTime, workShop.resource.resourceUpgradeValue(this.getUpgradeLevel(),this.getUpgradeMax()));
        this.setUpgradeSectionInstructions(`Speeds Up ${this._resource} Creation by ${tower.resource.resourceUpgradeValue(this.getUpgradeLevel(),this.getUpgradeMax()) * 100}%`);

        //update the observers
        this.notifyObserversOnUpgrade();

        this._upgradeCostGold = workShop.nextUpgradeCostInGold(this.getUpgradeLevel());
        this._upgradeCostFarmers = workShop.nextUpgradeCostInFarmers(this.getUpgradeLevel());
        this._upgradeCostResources = workShop.nextUpgradeCostInResources(this.getUpgradeLevel());

        //set models
        if (this.getUpgradeLevel() < this.getUpgradeMax()) {
            console.log('switch says level is:', this.getUpgradeLevel());
            //set the structures
            switch(this.getUpgradeLevel()) {
                
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

    private _reset() {
        this._resourceUpgradeValue = workShop.resource.resourceUpgradeValue(this.getUpgradeLevel(),this.getUpgradeMax());
        this._cycleTime = workShop.resource.cycleTime(this._upgradeLevel, workShop.resource.initialCycleTime, this.getResourceUpgradeValue());
        this._goldPerCycle = workShop.goldPerCycle;
        this._resourceAmountPerCycle = workShop.resource.resourcePerCycle;
        this._goldMultiplyer = workShop.goldMultiplyer(this.getUpgradeLevel(),this.getUpgradeMax());
        
        this.setUpgradeSectionInstructions(`Next Upgrade increases ${this.getResourceName()} by ${( workShop.resource.resourceUpgradeValue(this.getUpgradeLevel() + 1, this.getUpgradeMax())).toFixed(2)}% & increases the total Gold multiplyer by ${workShop.goldMultiplyer(this.getUpgradeLevel() + 1,this.getUpgradeMax()).toFixed(2)}%`);
        
        this._upgradeCostGold = workShop.nextUpgradeCostInGold(this.getUpgradeLevel());
        this._upgradeCostFarmers = workShop.nextUpgradeCostInFarmers(this.getUpgradeLevel());
        this._resourceMultiplyer = workShop.resource.multiplyer(this.getUpgradeLevel(), this.getUpgradeMax());

        this.getInSceneGui().setInfoText(`${this.getResourcePerCycle().toFixed(3)} ${this._resource}/cycle`);

        this.notifyObserversOnUpgrade();

        for (let i = 1; i <= this._structureModels.models.length - 1; i++) {
            this._structureModels.hideModel(i);
        }

        this._structureModels.showModel(0);

        this._upgradeSection.reset();
        this._inSceneGui.reset();

        this._moveStructureToStartPosition();
    }

    private _workShopUpgradeCallback() {
        if (DEBUGMODE) {
            console.log('WorkShopUpgradeChangeCalled');
        }
        
        //upgrade the State
        this.upgradeState();

        this._upgradeSection.setGoldCost(this.getUpgradeCostGold());
        this._upgradeSection.setFarmerCost(this.getUpgradeCostFarmers());
        this.getInSceneGui().setInfoText(`${this.getResourcePerCycle().toFixed(3)} ${this._resource}/cycle`);
    }

    private _workShopAdditionCallback() {
        if (DEBUGMODE) {
            console.log('addWorkshopCalled');
            
        }
        const window = (this._scene.getAppGui() as GUIPlay).getUpgradeWindow('castleUpgradeWindow') as UpgradeWindow;
        window.hideWindow(); 
        this.getInSceneGui().setInfoText(`${this.getResourcePerCycle().toFixed(3)} ${this._resource}/cycle`);
    }

    protected _kingdomResetUnique() {
        //overide in child class as it is for any special changes.
        if (DEBUGMODE) {
            console.log(`Called _kingdomResetUnique() for ${this.getName()} child structure class.`);
        }

        this._reset();
    }

}