import { StructureStateChildI } from "../../typings";
import { AddStructureButton } from "../GUI/structureUpgrades/addStructureButton";
import { InSceneStuctureGUI } from "../GUI/inSceneStructureGUI";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE, barracks, farmToBarracksPaths} from "../utils/CONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { StructureState } from "./structureState";
import { UpgradeWindow } from "../GUI/upgradeWindow";
import { StructureUpgradeSection } from "../GUI/structureUpgrades/structureUpgradeSection";
import { GUIPlay } from "../GUI/GUIPlay";
import { structureUpgradeAllowed } from "../utils/upgradeHelpers";
import { AddStewardButton } from "../GUI/structureUpgrades/addStewardButtons";

export class StructureBarracks extends StructureState implements StructureStateChildI {
    constructor(scene:PlayMode) {
        super(scene);
        this._name = barracks.name;
        this._character = barracks.character;
        this._stewardCost = barracks.stewardCost;
        this._animationPaths = farmToBarracksPaths;
        this._upgradeMax = barracks.upgradeMax;
        this._initGoldCost = barracks.initCosts.gold;
        this._initFarmerCost = barracks.initCosts.farmers;
        this._initResourceCost = barracks.initCosts.resources;
        this._initResource = barracks.initCosts.resourceName;
        this._upgradeCostGold = barracks.nextUpgradeCostInGold(this.getUpgradeLevel());
        this._upgradeCostFarmers = barracks.nextUpgradeCostInFarmers(this.getUpgradeLevel());
        this._resource = barracks.resource.name;
        this._cycleTime = barracks.resource.cycleTime(this._upgradeLevel, barracks.resource.initialCycleTime, barracks.resource.resourceUpgradeValue(this.getUpgradeLevel(),this.getUpgradeMax()));
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, barracks.models, barracks.clickbox, barracks.gamePos);
        this._goldPerCycle = barracks.goldPerCycle;
        this._resourceAmountPerCycle = barracks.resource.resourcePerCycle;
        this._inSceneGui = new InSceneStuctureGUI('BarracksSceneGui', this, this.getResourceName());
        this._upgradesWindow = new UpgradeWindow('BarracksUpgradeWindow');
        this._upgradeSectionInstructions = `Speeds Up ${this._resource} Capture by ${barracks.resource.resourceUpgradeValue(this.getUpgradeLevel(),this.getUpgradeMax()) * 100}%`;
        this._upgradeSection = new StructureUpgradeSection('BarrackUpgradeSection', this, () => {this._barracksUpgradeCallback()});
        this._addStructureButton = new AddStructureButton('addBarracksButton', this, () => {this._barracksAdditionCallback()});
        this._addStewartButton = new AddStewardButton('addBarracksStewardButton', this);
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
        this._cycleTime = barracks.resource.cycleTime(this._upgradeLevel, barracks.resource.initialCycleTime, barracks.resource.resourceUpgradeValue(this.getUpgradeLevel(),this.getUpgradeMax()));
        this.setUpgradeSectionInstructions(`Speeds Up ${this._resource} Capture by ${barracks.resource.resourceUpgradeValue(this.getUpgradeLevel(),this.getUpgradeMax()) * 100}%`);

        //update the observers
        this.notifyObserversOnUpgrade();

        this._upgradeCostFarmers = barracks.nextUpgradeCostInFarmers(this.getUpgradeLevel());
        this._upgradeCostGold = barracks.nextUpgradeCostInGold(this.getUpgradeLevel());

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

    private _barracksUpgradeCallback() {
        if (DEBUGMODE) {
            console.log('barracksUpgradeChangeCalled');
        }
        
        //upgrade the State
        this.upgradeState();

        this._upgradeSection.setGoldCost(this.getUpgradeCostGold());
        this._upgradeSection.setFarmerCost(this.getUpgradeCostFarmers());


    }

    private _barracksAdditionCallback() {
        if (DEBUGMODE) {
            console.log('addBarracksCalled');
        }     

        const window = (this._scene.getAppGui() as GUIPlay).getUpgradeWindow('castleUpgradeWindow') as UpgradeWindow;
        window.hideWindow(); 
    }

}