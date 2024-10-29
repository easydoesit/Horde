import { StructureStateChildI } from "../../typings";
import { GUIPlay } from "../GUI/GUIPlay";
import { InSceneStuctureGUI } from "../GUI/inSceneStructureGUI";
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
        this._animationPaths = farmToForgePaths;
        this._upgradeMax = forge.upgradeMax;
        this._upgradeCostGold = forge.nextUpgradeCostInGold(this.getUpgradeLevel());
        this._upgradeCostFarmers = forge.nextUpgradeCostInFarmers(this.getUpgradeLevel());
        this._upgradeCostResources = forge.nextUpgradeCostInResources(this.getUpgradeLevel());
        this._resource = forge.resource.name;
        this._cycleTime = forge.resource.cycleTime(this.getUpgradeLevel(), forge.resource.initialCycleTime, forge.resource.resourceUpgradeValue);
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, forge.models, forge.clickbox, forge.gamePos);
        this._goldPerCycle = forge.goldPerCycle;
        this._resourceAmountPerCycle = forge.resource.resourcePerCycle;
        this._inSceneGui = new InSceneStuctureGUI('ForgeSceneGui', this, this.getResourceName());
        this._upgradesWindow = new UpgradeWindow('ForgeUpgradeWindow');
        this._upgradeSection = new StructureUpgradeSection('ForgeUpgradeSection', `Speeds Up Weapon Resourceion by ${forge.resource.resourceUpgradeValue * 100}%`, this, () => {this._forgeUpgradeCallback()});
        this._addStructureButton = new AddStructureButton('addForgeButton', this, () => {this._forgeAdditionCallback()});
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
            this._cycleTime = forge.resource.cycleTime(this.getUpgradeLevel(),forge.resource.initialCycleTime, forge.resource.resourceUpgradeValue);
      
            //update the observers
            this.notifyObserversOnUpgrade();

            this._upgradeCostFarmers = forge.nextUpgradeCostInFarmers(this.getUpgradeLevel());
            this._upgradeCostResources = forge.nextUpgradeCostInResources(this.getUpgradeLevel());
            this._upgradeCostGold = forge.nextUpgradeCostInGold(this.getUpgradeLevel());

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