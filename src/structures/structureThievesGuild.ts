import { StructureStateChildI } from "../../typings";
import { GUIPlay } from "../GUI/GUIPlay";
import { InSceneStuctureGUI } from "../GUI/inSceneStructureGUI";
import { AddStewardButton } from "../GUI/structureUpgrades/addStewardButtons";
import { AddStructureButton } from "../GUI/structureUpgrades/addStructureButton";
import { StructureUpgradeSection } from "../GUI/structureUpgrades/structureUpgradeSection";
import { UpgradeWindow } from "../GUI/upgradeWindow";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE, farmToThievesGuildPaths, thievesGuild} from "../utils/CONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { structureUpgradeAllowed } from "../utils/upgradeHelpers";
import { StructureState } from "./structureState";

export class StructureThievesGuild extends StructureState implements StructureStateChildI {
    constructor(scene:PlayMode) {
        super(scene);
        this._name = thievesGuild.name;
        this._character = thievesGuild.character;
        this._stewardCost = thievesGuild.stewardCost;
        this._initGoldCost = thievesGuild.initCosts.gold;
        this._initFarmerCost = thievesGuild.initCosts.farmers;
        this._initResourceCost = thievesGuild.initCosts.resources;
        this._initResource = thievesGuild.initCosts.resourceName;
        this._animationPaths = farmToThievesGuildPaths;
        this._upgradeMax = thievesGuild.upgradeMax;
        this._upgradeCostGold = thievesGuild.nextUpgradeCostInGold(this.getUpgradeLevel());
        this._upgradeCostFarmers = thievesGuild.nextUpgradeCostInFarmers(this.getUpgradeLevel());
        this._upgradeCostResources = thievesGuild.nextUpgradeCostInResources(this.getUpgradeLevel());
        this._resource = thievesGuild.resource.name;
        this._cycleTime = thievesGuild.resource.cycleTime(this._upgradeLevel, thievesGuild.resource.initialCycleTime, thievesGuild.resource.resourceUpgradeValue(this.getUpgradeLevel(),this.getUpgradeMax()));
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, thievesGuild.models, thievesGuild.clickbox, thievesGuild.gamePos);
        this._goldPerCycle = thievesGuild.goldPerCycle;
        this._resourceAmountPerCycle = thievesGuild.resource.resourcePerCycle;
        this._inSceneGui = new InSceneStuctureGUI('ThievesGuildSceneGui', this, this._resource);
        this._upgradesWindow = new UpgradeWindow('ThievesGuildUpgradeWindow');
        this._upgradeSectionInstructions = `Speeds Up ${this._resource} Capture by ${thievesGuild.resource.resourceUpgradeValue(this.getUpgradeLevel(),this.getUpgradeMax()) * 100}%`;
        this._upgradeSection = new StructureUpgradeSection('ThievesGuildUpgradeSection', this, () => {this._thievesGuildUpgradeCallback()});
        this._addStructureButton = new AddStructureButton('addThievesGuildButton', this, () => {this._thievesGuildAdditionCallback()});
        this._addStewartButton = new AddStewardButton('addThievesGuildStewardButton', this);
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
        this._cycleTime = thievesGuild.resource.cycleTime(this._upgradeLevel, thievesGuild.resource.initialCycleTime, thievesGuild.resource.resourceUpgradeValue(this.getUpgradeLevel(),this.getUpgradeMax()));
        this.setUpgradeSectionInstructions(`Speeds Up ${this._resource} Capture by ${thievesGuild.resource.resourceUpgradeValue(this.getUpgradeLevel(),this.getUpgradeMax()) * 100}%`);
        //update the observers
        this.notifyObserversOnUpgrade();

        this._upgradeCostGold = thievesGuild.nextUpgradeCostInGold(this.getUpgradeLevel());
        this._upgradeCostFarmers = thievesGuild.nextUpgradeCostInFarmers(this.getUpgradeLevel());
        this._upgradeCostResources = thievesGuild.nextUpgradeCostInResources(this.getUpgradeLevel());

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
        this._resourceUpgradeValue = thievesGuild.resource.resourceUpgradeValue(this.getUpgradeLevel(),this.getUpgradeMax());
        this._cycleTime = thievesGuild.resource.cycleTime(this._upgradeLevel, thievesGuild.resource.initialCycleTime, this.getResourceUpgradeValue());
        this._goldPerCycle = thievesGuild.goldPerCycle;
        this._resourceAmountPerCycle = thievesGuild.resource.resourcePerCycle;
        this._goldMultiplyer = thievesGuild.goldMultiplyer(this.getUpgradeLevel(),this.getUpgradeMax());
        
        this.setUpgradeSectionInstructions(`Next Upgrade increases ${this.getResourceName()} by ${( thievesGuild.resource.resourceUpgradeValue(this.getUpgradeLevel() + 1, this.getUpgradeMax())).toFixed(2)}% & increases the total Gold multiplyer by ${thievesGuild.goldMultiplyer(this.getUpgradeLevel() + 1,this.getUpgradeMax()).toFixed(2)}%`);
        
        this._upgradeCostGold = thievesGuild.nextUpgradeCostInGold(this.getUpgradeLevel());
        this._upgradeCostFarmers = thievesGuild.nextUpgradeCostInFarmers(this.getUpgradeLevel());
        this._resourceMultiplyer = thievesGuild.resource.multiplyer(this.getUpgradeLevel(), this.getUpgradeMax());

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

    private _thievesGuildUpgradeCallback() {
        if (DEBUGMODE) {
            console.log('thievesGuildUpgradeChangeCalled');
        }
        
        //upgrade the State
        this.upgradeState();

        this._upgradeSection.setGoldCost(this.getUpgradeCostGold());
        this._upgradeSection.setFarmerCost(this.getUpgradeCostFarmers());
    }

    private _thievesGuildAdditionCallback() {
        if (DEBUGMODE) {
            console.log('addthievesGuildCalled');
        }
        
        const window = (this._scene.getAppGui() as GUIPlay).getUpgradeWindow('castleUpgradeWindow') as UpgradeWindow;
        window.hideWindow(); 
    }

    protected _kingdomResetUnique() {
        //overide in child class as it is for any special changes.
        if (DEBUGMODE) {
            console.log(`Called _kingdomResetUnique() for ${this.getName()} child structure class.`);
        }

        this._reset();
    }

}