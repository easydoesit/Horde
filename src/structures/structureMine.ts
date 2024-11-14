import { StructureStateChildI } from "../../typings";
import { AddStructureButton } from "../GUI/structureUpgrades/addStructureButton";
import { InSceneStuctureGUI } from "../GUI/inSceneStructureGUI";
import { StructureUpgradeSection } from "../GUI/structureUpgrades/structureUpgradeSection";
import { UpgradeWindow } from "../GUI/upgradeWindow";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE, farmToMinePaths, mine } from "../utils/CONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { StructureState } from "./structureState";
import { GUIPlay } from "../GUI/GUIPlay";
import { structureUpgradeAllowed } from "../utils/upgradeHelpers";
import { AddStewardButton } from "../GUI/structureUpgrades/addStewardButtons";

export class StructureMine extends StructureState implements StructureStateChildI {
    constructor(scene:PlayMode) {
        super(scene);
        this._name = mine.name
        this._character = mine.character;
        this._stewardCost = mine.stewardCost;
        this._initGoldCost = mine.initCosts.gold;
        this._initFarmerCost = mine.initCosts.farmers;
        this._initResourceCost = mine.initCosts.resources;
        this._initResource = mine.initCosts.resourceName;
        this._animationPaths = farmToMinePaths;
        this._upgradeMax = mine.upgradeMax;
        this._upgradeCostGold = mine.nextUpgradeCostInGold(this._upgradeLevel);
        this._upgradeCostFarmers = mine.nextUpgradeCostInFarmers(this._upgradeLevel);
        this._resource = mine.resource.name;
        this._resourceUpgradeValue = mine.resource.resourceUpgradeValue(this.getUpgradeLevel(),this.getUpgradeMax());
        this._cycleTime = mine.resource.cycleTime(this._upgradeLevel, mine.resource.initialCycleTime, this.getResourceUpgradeValue());
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, mine.models, mine.clickbox, mine.gamePos);
        this._goldPerCycle = mine.goldPerCycle;
        this._resourceAmountPerCycle = mine.resource.resourcePerCycle;
        this._inSceneGui = new InSceneStuctureGUI('MineSceneGui', this, 'Ore');
        this._upgradesWindow = new UpgradeWindow('mineUpgradeWindow');
        this._upgradeSectionInstructions = `Next Upgrade increases ${this.getResourceName()} by ${( mine.resource.resourceUpgradeValue(this.getUpgradeLevel() + 1,this.getUpgradeMax())).toFixed(2)}% & increases the total Gold multiplyer by ${mine.goldMultiplyer(this.getUpgradeLevel() + 1,this.getUpgradeMax()).toFixed(2)}%`;
        this._upgradeSection = new StructureUpgradeSection('Mine Upgrades', this, () => {this._mineUpgradeCallback()});
        this._addStructureButton = new AddStructureButton('addMineButton', this, () => {this._mineAdditionCallback()});
        this._addStewartButton = new AddStewardButton('addMineStewardButton', this);

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
        this._cycleTime = mine.resource.cycleTime(this.getUpgradeLevel(), mine.resource.initialCycleTime, mine.resource.resourceUpgradeValue(this.getUpgradeLevel(),this.getUpgradeMax()));
        this._goldMultiplyer = mine.goldMultiplyer(this.getUpgradeLevel(),this.getUpgradeMax());
        this.setUpgradeSectionInstructions(`Next Upgrade increases ${this.getResourceName()} by ${( mine.resource.resourceUpgradeValue(this.getUpgradeLevel() + 1,this.getUpgradeMax())).toFixed(2)}% & increases the total Gold multiplyer by ${mine.goldMultiplyer(this.getUpgradeLevel() + 1,this.getUpgradeMax()).toFixed(2)}%`);
    
        this._upgradeCostFarmers = mine.nextUpgradeCostInFarmers(this.getUpgradeLevel());
        this._upgradeCostGold = mine.nextUpgradeCostInGold(this.getUpgradeLevel());
        
        this.notifyObserversOnUpgrade();

        this._resourceAmountPerCycle = this.getResourcePerCycle() + (this.getResourcePerCycle() * this.getResourceMultiplyer()/100);

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
        this._resourceUpgradeValue = mine.resource.resourceUpgradeValue(this.getUpgradeLevel(),this.getUpgradeMax());
        this._cycleTime = mine.resource.cycleTime(this._upgradeLevel, mine.resource.initialCycleTime, this.getResourceUpgradeValue());
        this._goldPerCycle = mine.goldPerCycle;
        this._resourceAmountPerCycle = mine.resource.resourcePerCycle;
        this._goldMultiplyer = mine.goldMultiplyer(this.getUpgradeLevel(),this.getUpgradeMax());
        
        this.setUpgradeSectionInstructions(`Next Upgrade increases ${this.getResourceName()} by ${( mine.resource.resourceUpgradeValue(this.getUpgradeLevel() + 1, this.getUpgradeMax())).toFixed(2)}% & increases the total Gold multiplyer by ${mine.goldMultiplyer(this.getUpgradeLevel() + 1,this.getUpgradeMax()).toFixed(2)}%`);
        
        this._upgradeCostGold = mine.nextUpgradeCostInGold(this.getUpgradeLevel());
        this._upgradeCostFarmers = mine.nextUpgradeCostInFarmers(this.getUpgradeLevel());
        this._resourceMultiplyer = mine.resource.multiplyer(this.getUpgradeLevel(), this.getUpgradeMax());

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

    private _mineUpgradeCallback() {
        if (DEBUGMODE) {
            console.log('mineUpgradeChangeCalled');
        }
        
        //upgrade the State
        this.upgradeState();

        this.getUpgradeSection().setGoldCost(this.getUpgradeCostGold());
        this.getUpgradeSection().setFarmerCost(this.getUpgradeCostFarmers());
        this.getInSceneGui().setInfoText(`${this.getResourcePerCycle().toFixed(3)} ${this._resource}/cycle`);
        
    }

    private _mineAdditionCallback() {
        if (DEBUGMODE) {
            console.log('addMineCalled');
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