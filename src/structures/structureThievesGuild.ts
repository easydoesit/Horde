import { StructureStateChildI } from "../../typings";
import { GUIPlay } from "../GUI/GUIPlay";
import { InSceneStuctureGUI } from "../GUI/inSceneStructureGUI";
import { AddStructureButton } from "../GUI/structureUpgrades/addStructureButton";
import { StructureUpgradeSection } from "../GUI/structureUpgrades/structureUpgradeSection";
import { UpgradeWindow } from "../GUI/upgradeWindow";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE, thievesGuild} from "../utils/CONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { structureUpgradeAllowed } from "../utils/upgradeHelpers";
import { StructureState } from "./structureState";

export class StructureThievesGuild extends StructureState implements StructureStateChildI {
    constructor(scene:PlayMode) {
        super(scene);
        this._name = thievesGuild.name;
        this._character = thievesGuild.character;
        this._animationPaths = thievesGuild.paths;
        this._upgradeMax = thievesGuild.upgradeMax;
        this._upgradeCostGold = thievesGuild.nextUpgradeCostInGold(this.getUpgradeLevel());
        this._upgradeCostFarmers = thievesGuild.nextUpgradeCostInFarmers(this.getUpgradeLevel());
        this._upgradeCostResources = thievesGuild.nextUpgradeCostInResources(this.getUpgradeLevel());
        this._resource = thievesGuild.resource.name;
        this._cycleTime = thievesGuild.resource.cycleTime(this._upgradeLevel, thievesGuild.resource.initialCycleTime, thievesGuild.resource.resourceUpgradeValue);
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, thievesGuild.models, thievesGuild.clickbox, thievesGuild.gamePos);
        this._goldPerCycle = thievesGuild.goldPerCycle;
        this._resourceAmountPerCycle = thievesGuild.resource.resourcePerCycle;
        this._inSceneGui = new InSceneStuctureGUI('ThievesGuildSceneGui', this, this._resource);
        this._upgradesWindow = new UpgradeWindow('ThievesGuildUpgradeWindow');
        this._upgradeSection = new StructureUpgradeSection('ThievesGuildUpgradeSection', `Speeds Up ${this._resource} Capture by ${thievesGuild.resource.resourceUpgradeValue * 100}%`, this, () => {this._thievesGuildUpgradeCallback()});
        this._addStructureButton = new AddStructureButton('addThievesGuildButton', this, () => {this._thievesGuildAdditionCallback()});
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

            this._upgradeLevel += 1;
            this._cycleTime = thievesGuild.resource.cycleTime(this._upgradeLevel, thievesGuild.resource.initialCycleTime, thievesGuild.resource.resourceUpgradeValue);
      
            //update the observers
            this.notifyObserversOnUpgrade();

            this._upgradeCostGold = thievesGuild.nextUpgradeCostInGold(this.getUpgradeLevel());
            this._upgradeCostFarmers = thievesGuild.nextUpgradeCostInFarmers(this.getUpgradeLevel());
            this._upgradeCostResources = thievesGuild.nextUpgradeCostInResources(this.getUpgradeLevel());

        }
    }

    private _thievesGuildUpgradeCallback() {
        if (DEBUGMODE) {
            console.log('thievesGuildUpgradeChangeCalled');
        }
        
        //upgrade the State
        this.upgradeState();

        this._upgradeSection.changeGoldCost(this.getUpgradeCostGold());
        this._upgradeSection.changeFarmerCost(this.getUpgradeCostFarmers());
    }

    private _thievesGuildAdditionCallback() {
        if (DEBUGMODE) {
            console.log('addthievesGuildCalled');
        }
        
        const window = (this._scene.getAppGui() as GUIPlay).getUpgradeWindow('castleUpgradeWindow') as UpgradeWindow;
        window.hideWindow(); 
    }
}