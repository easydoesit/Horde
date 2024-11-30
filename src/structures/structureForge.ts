import { StructureStateChildI } from "../../typings";
import { GUIPlay } from "../GUI/GUIPlay";
import { InSceneStuctureGUI } from "../GUI/inSceneStructureGUI";
import { AddStewardButton } from "../GUI/structureUpgrades/addStewardButtons";
import { AddStructureButton } from "../GUI/structureUpgrades/addStructureButton";
import { StructureUpgradeSection } from "../GUI/structureUpgrades/structureUpgradeSection";
import { UpgradeWindow } from "../GUI/upgradeWindow";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE, farmToForgePaths, forge} from "../utils/CONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { structureUpgradeAllowed } from "../utils/upgradeHelpers";
import { StructureState } from "./structureState";

export class StructureForge extends StructureState implements StructureStateChildI {
    constructor(scene:PlayMode) {
        super(scene);
        this._name = forge.name;
        this._character = forge.character;
        this._stewardCost = forge.stewardCost;
        this._initGoldCost = forge.initCosts.gold;
        this._initFarmerCost = forge.initCosts.farmers;
        this._initResourceCost = forge.initCosts.resources;
        this._initResource = forge.initCosts.resourceName;
        this._animationPaths = farmToForgePaths;
        this._upgradeMax = forge.upgradeMax;
        this._upgradeCostGold = forge.nextUpgradeCostInGold(this.getUpgradeLevel());
        this._upgradeCostFarmers = forge.nextUpgradeCostInFarmers(this.getUpgradeLevel());
        this._upgradeCostResources = forge.nextUpgradeCostInResources(this.getUpgradeLevel());
        this._resource = forge.resource.name;
        this._cycleTime = forge.resource.cycleTime(this.getUpgradeLevel(), forge.resource.initialCycleTime, forge.resource.resourceUpgradeValue(this.getUpgradeLevel(),this.getUpgradeMax()));
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, forge.models, forge.clickbox, forge.gamePos);
        this._goldPerCycle = forge.goldPerCycle;
        this._resourceAmountPerCycle = forge.resource.resourcePerCycle;
        this._inSceneGui = new InSceneStuctureGUI('ForgeSceneGui', this, this.getResourceName());
        this._upgradesWindow = new UpgradeWindow('ForgeUpgradeWindow');
        //this._upgradeSectionInstructions = `Speeds Up Weapon Resource Creation by ${forge.resource.resourceUpgradeValue(this.getUpgradeLevel(),this.getUpgradeMax()) * 100}%` <-- This is wrong CHECK ALL STRUCTURES
        this._upgradeSectionInstructions = `Next Upgrade increases ${this.getResourceName()} by ${( forge.resource.resourceUpgradeValue(this.getUpgradeLevel() + 1,this.getUpgradeMax())).toFixed(2)}% & increases the total Gold multiplyer by ${forge.goldMultiplyer(this.getUpgradeLevel() + 1,this.getUpgradeMax()).toFixed(2)}%`;
        this._upgradeSection = new StructureUpgradeSection('ForgeUpgradeSection', this, () => {this._forgeUpgradeCallback()});
        this._addStructureButton = new AddStructureButton('addForgeButton', this, () => {this._forgeAdditionCallback()});
        this._addStewartButton = new AddStewardButton('addForgeStewardButton', this);
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

        //update the variables
        //these ones are before the notify
        this._upgradeLevel += 1;
        //this._cycleTime = forge.resource.cycleTime(this.getUpgradeLevel(),forge.resource.initialCycleTime, forge.resource.resourceUpgradeValue(this.getUpgradeLevel(),this.getUpgradeMax()));
        this.setUpgradeSectionInstructions(`Speeds Up Weapon Resource Creation by ${forge.resource.resourceUpgradeValue(this.getUpgradeLevel(),this.getUpgradeMax()) * 100}%`);
        //update the observers
        this.notifyObserversOnUpgrade();

        this._upgradeCostFarmers = forge.nextUpgradeCostInFarmers(this.getUpgradeLevel());
        this._upgradeCostResources = forge.nextUpgradeCostInResources(this.getUpgradeLevel());
        this._upgradeCostGold = forge.nextUpgradeCostInGold(this.getUpgradeLevel());

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
        this._resourceUpgradeValue = forge.resource.resourceUpgradeValue(this.getUpgradeLevel(),this.getUpgradeMax());
        this._cycleTime = forge.resource.cycleTime(this._upgradeLevel, forge.resource.initialCycleTime, this.getResourceUpgradeValue());
        this._goldPerCycle = forge.goldPerCycle;
        this._resourceAmountPerCycle = forge.resource.resourcePerCycle;
        this._goldMultiplyer = forge.goldMultiplyer(this.getUpgradeLevel(),this.getUpgradeMax());
        
        this.setUpgradeSectionInstructions(`Next Upgrade increases ${this.getResourceName()} by ${( forge.resource.resourceUpgradeValue(this.getUpgradeLevel() + 1, this.getUpgradeMax())).toFixed(2)}% & increases the total Gold multiplyer by ${forge.goldMultiplyer(this.getUpgradeLevel() + 1,this.getUpgradeMax()).toFixed(2)}%`);
        
        this._upgradeCostGold = forge.nextUpgradeCostInGold(this.getUpgradeLevel());
        this._upgradeCostFarmers = forge.nextUpgradeCostInFarmers(this.getUpgradeLevel());
        this._resourceMultiplyer = forge.resource.multiplyer(this.getUpgradeLevel(), this.getUpgradeMax());

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

    private _forgeUpgradeCallback() {
        if (DEBUGMODE) {
            console.log('forgeUpgradeChangeCalled');
        }
        
        //upgrade the State
        this.upgradeState();

        this.getUpgradeSection().setGoldCost(this.getUpgradeCostGold());
        this.getUpgradeSection().setFarmerCost(this.getUpgradeCostFarmers());
        this.getInSceneGui().setInfoText(`${this.getResourcePerCycle().toFixed(3)} ${this._resource}/cycle`);
    }

    private _forgeAdditionCallback() {
        if (DEBUGMODE) {
            console.log('addForgeCalled');
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