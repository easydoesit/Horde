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
        this._upgradeSectionInstructions = `Speeds Up Weapon Resourceion by ${forge.resource.resourceUpgradeValue(this.getUpgradeLevel(),this.getUpgradeMax()) * 100}%`
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
        this._cycleTime = forge.resource.cycleTime(this.getUpgradeLevel(),forge.resource.initialCycleTime, forge.resource.resourceUpgradeValue(this.getUpgradeLevel(),this.getUpgradeMax()));
        this.changeUpgradeSectionInstructions(`Speeds Up Weapon Resourceion by ${forge.resource.resourceUpgradeValue(this.getUpgradeLevel(),this.getUpgradeMax()) * 100}%`);
        //update the observers
        this.notifyObserversOnUpgrade();

        this._upgradeCostFarmers = forge.nextUpgradeCostInFarmers(this.getUpgradeLevel());
        this._upgradeCostResources = forge.nextUpgradeCostInResources(this.getUpgradeLevel());
        this._upgradeCostGold = forge.nextUpgradeCostInGold(this.getUpgradeLevel());

        //change models
        if (this.getUpgradeLevel() < this.getUpgradeMax()) {
            console.log('switch says level is:', this.getUpgradeLevel());
            //change the structures
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

    private _forgeUpgradeCallback() {
        if (DEBUGMODE) {
            console.log('forgeUpgradeChangeCalled');
        }
        
        //upgrade the State
        this.upgradeState();

        this.getUpgradeSection().changeGoldCost(this.getUpgradeCostGold());
        this.getUpgradeSection().changeFarmerCost(this.getUpgradeCostFarmers());

    }

    private _forgeAdditionCallback() {
        if (DEBUGMODE) {
            console.log('addForgeCalled');
        }     

        const window = (this._scene.getAppGui() as GUIPlay).getUpgradeWindow('castleUpgradeWindow') as UpgradeWindow;
        window.hideWindow(); 
    
    }

}