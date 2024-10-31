import { StructureStateChildI } from "../../typings";
import { GUIPlay } from "../GUI/GUIPlay";
import { InSceneStuctureGUI } from "../GUI/inSceneStructureGUI";
import { AddStewardButton } from "../GUI/structureUpgrades/addStewardButtons";
import { AddStructureButton } from "../GUI/structureUpgrades/addStructureButton";
import { StructureUpgradeSection } from "../GUI/structureUpgrades/structureUpgradeSection";
import { UpgradeWindow } from "../GUI/upgradeWindow";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE, farmToTavernPaths, tavern} from "../utils/CONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { structureUpgradeAllowed } from "../utils/upgradeHelpers";
import { StructureState } from "./structureState";

export class StructureTavern extends StructureState implements StructureStateChildI {
    constructor(scene:PlayMode) {
        super(scene);
        this._name = tavern.name;
        this._character = tavern.character;
        this._stewardCost = tavern.stewardCost;
        this._initGoldCost = tavern.initCosts.gold;
        this._initFarmerCost = tavern.initCosts.farmers;
        this._initResourceCost = tavern.initCosts.resources;
        this._initResource = tavern.initCosts.resourceName;
        this._animationPaths = farmToTavernPaths;
        this._upgradeMax = tavern.upgradeMax;
        this._upgradeCostGold = tavern.nextUpgradeCostInGold(this.getUpgradeLevel());
        this._upgradeCostFarmers = tavern.nextUpgradeCostInFarmers(this.getUpgradeLevel());
        this._upgradeCostResources = tavern.nextUpgradeCostInResources(this.getUpgradeLevel())
        this._resource = tavern.resource.name;
        this._cycleTime = tavern.resource.cycleTime(this.getUpgradeLevel(), tavern.resource.initialCycleTime,tavern.resource.resourceUpgradeValue(this.getUpgradeLevel(),this.getUpgradeMax()));
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, tavern.models, tavern.clickbox, tavern.gamePos);
        this._goldPerCycle = tavern.goldPerCycle;
        this._resourceAmountPerCycle = tavern.resource.resourcePerCycle;
        this._inSceneGui = new InSceneStuctureGUI('TavernSceneGui', this, this._resource);
        this._upgradesWindow = new UpgradeWindow('TavernUpgradeWindow');
        this._upgradeSectionInstructions = `Speeds Up ${this._resource} Creation by ${tavern.resource.resourceUpgradeValue(this.getUpgradeLevel(),this.getUpgradeMax()) * 100}%`;
        this._upgradeSection = new StructureUpgradeSection('TavernUpgradeSection', this, () => {this._tavernUpgradeCallback()});
        this._addStructureButton = new AddStructureButton('addTavernButton', this, () => {this._tavernAdditionCallback()});
        this._addStewartButton = new AddStewardButton('addTavernStewardButton', this);
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
        this._cycleTime = tavern.resource.cycleTime(this.getUpgradeLevel(), tavern.resource.initialCycleTime,tavern.resource.resourceUpgradeValue(this.getUpgradeLevel(),this.getUpgradeMax()));
        this.changeUpgradeSectionInstructions(`Speeds Up ${this._resource} Creation by ${tavern.resource.resourceUpgradeValue(this.getUpgradeLevel(),this.getUpgradeMax()) * 100}%`);

        this.notifyObserversOnUpgrade();

        this._upgradeCostFarmers = tavern.nextUpgradeCostInFarmers(this.getUpgradeLevel());
        this._upgradeCostGold = tavern.nextUpgradeCostInGold(this.getUpgradeLevel());
        this._upgradeCostResources = tavern.nextUpgradeCostInResources(this._upgradeLevel);

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

    private _tavernUpgradeCallback() {
        if (DEBUGMODE) {
            console.log('TavernUpgradeChangeCalled');
        }
        
        //upgrade the State
        this.upgradeState();

        this.notifyObserversOnUpgrade();

        this._upgradeSection.changeGoldCost(this.getUpgradeCostGold());
        this._upgradeSection.changeFarmerCost(this.getUpgradeCostFarmers());

    }

    private _tavernAdditionCallback() {
        if (DEBUGMODE) {
            console.log('addTavernCalled');
        }
        
        const window = (this._scene.getAppGui() as GUIPlay).getUpgradeWindow('castleUpgradeWindow') as UpgradeWindow;
        window.hideWindow(); 
    }
}