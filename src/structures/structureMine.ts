import { StructureStateChildI } from "../../typings";
import { AddStructureButton } from "../GUI/structureUpgrades/addStructureButton";
import { InSceneStuctureGUI } from "../GUI/inSceneStructureGUI";
import { StructureUpgradeSection } from "../GUI/structureUpgrades/structureUpgradeSection";
import { UpgradeWindow } from "../GUI/upgradeWindow";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE, mine } from "../utils/CONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { StructureState } from "./structureState";
import { GUIPlay } from "../GUI/GUIPlay";
import { structureUpgradeAllowed } from "../utils/upgradeHelpers";

export class StructureMine extends StructureState implements StructureStateChildI {
    constructor(scene:PlayMode) {
        super(scene);
        this._name = mine.name
        this._character = mine.character;
        this._animationPaths = mine.paths;
        this._upgradeMax = mine.upgradeMax;
        this._upgradeCostGold = mine.nextUpgradeCostInGold(this._upgradeLevel);
        this._upgradeCostFarmers = mine.nextUpgradeCostInFarmers(this._upgradeLevel);
        this._resource = mine.resource.name;
        this._cycleTime = mine.resource.cycleTime(this._upgradeLevel, mine.resource.initialCycleTime, mine.resource.resourceUpgradeValue);
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, mine.models, mine.clickbox, mine.gamePos);
        this._goldPerCycle = mine.goldPerCycle;
        this._resourceAmountPerCycle = mine.resource.resourcePerCycle;
        this._inSceneGui = new InSceneStuctureGUI('MineSceneGui', this, 'Ore');
        this._upgradesWindow = new UpgradeWindow('mineUpgradeWindow');
        this._upgradeSection = new StructureUpgradeSection('MineUpgradeSection', `Speeds Up ${this._resource} production by ${mine.resource.resourceUpgradeValue * 100}%`, this, () => {this._mineUpgradeCallback()});
        this._addStructureButton = new AddStructureButton('addMineButton', this, () => {this._mineAdditionCallback()});
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
            this._cycleTime = mine.resource.cycleTime(this.getUpgradeLevel(), mine.resource.initialCycleTime, mine.resource.resourceUpgradeValue);
      
            this.notifyObserversOnUpgrade();

            this._upgradeCostFarmers = mine.nextUpgradeCostInFarmers(this._upgradeLevel);
            this._upgradeCostGold = mine.nextUpgradeCostInGold(this._upgradeLevel);

        }
    }
    
    private _mineUpgradeCallback() {
        if (DEBUGMODE) {
            console.log('mineUpgradeChangeCalled');
        }
        
        //upgrade the State
        this.upgradeState();

        this.getUpgradeSection().changeGoldCost(this.getUpgradeCostGold());
        this.getUpgradeSection().changeFarmerCost(this.getUpgradeCostFarmers());

    }

    private _mineAdditionCallback() {
        if (DEBUGMODE) {
            console.log('addMineCalled');
        }
        
        const window = (this._scene.getAppGui() as GUIPlay).getUpgradeWindow('castleUpgradeWindow') as UpgradeWindow;
        window.hideWindow(); 

    }

}