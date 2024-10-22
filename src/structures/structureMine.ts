import { StructureStateChildI } from "../../typings";
import { AddStructureButton } from "../GUI/structureUpgrades/addStructureButton";
import { InSceneStuctureGUI } from "../GUI/inSceneStructureGUI";
import { StructureUpgradeSection } from "../GUI/structureUpgrades/structureUpgradeSection";
import { UpgradeWindow } from "../GUI/upgradeWindow";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE, farmToMinePaths, mineClickBox, mineModels, minePos } from "../utils/CONSTANTS";
import { mineGoldPerCycle, mineUpgradeCostFarmers, mineUpgradeCostGold, mineUpgradeMax, orePerCycle, timeToMakeOre, oreUpgradeValue } from "../utils/MATHCONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { StructureState } from "./structureState";
import { GUIPlay } from "../GUI/GUIPlay";

export class StructureMine extends StructureState implements StructureStateChildI {
    constructor(scene:PlayMode) {
        super(scene);
        this._name = 'Mine'
        this._character = 'miner';
        this._animationPaths = farmToMinePaths;
        this._upgradeMax = mineUpgradeMax;
        this._upgradeCostGold = Math.round(mineUpgradeCostGold(this.getUpgradeLevel())*1000/1000);
        this._upgradeCostFarmers = Math.round(mineUpgradeCostFarmers(this.getUpgradeLevel()));
        this._product = 'Ore';
        this._cycleTime = timeToMakeOre(this.getUpgradeLevel());
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, mineModels, mineClickBox, minePos);
        this._goldPerCycle = mineGoldPerCycle;
        this._productAmountPerCycle = orePerCycle;
        this._inSceneGui = new InSceneStuctureGUI('MineSceneGui', this, 'Ore');
        this._upgradesWindow = new UpgradeWindow('mineUpgradeWindow');
        this._upgradeSection = new StructureUpgradeSection('MineUpgradeSection', `Speeds Up Ore Production by ${oreUpgradeValue * 100}%`, this, () => {this._mineUpgradeCallback()});
        this._addStructureButton = new AddStructureButton('addMineButton', this, () => {this._mineAdditionCallback()});
        this._addUpgradePanel();
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
            this._cycleTime = timeToMakeOre(this.getUpgradeLevel());
      
            this.notifyObserversOnUpgrade();

            this._upgradeCostFarmers = mineUpgradeCostFarmers(this.getUpgradeLevel());
            this._upgradeCostGold = Math.round(mineUpgradeCostGold(this.getUpgradeLevel())*1000)/1000;

        }
    }
    
    private _mineUpgradeCallback() {
        if (DEBUGMODE) {
            console.log('mineUpgradeChangeCalled');
        }
        
        //upgrade the State
        this.upgradeState();

        this._upgradeSection.changeGoldCost(this.getUpgradeCostGold());
        this._upgradeSection.changeFarmerCost(this.getUpgradeCostFarmers());

    }

    private _mineAdditionCallback() {
        if (DEBUGMODE) {
            console.log('addMineCalled');
        }
        
        const window = (this._scene.getAppGui() as GUIPlay).getUpgradeWindow('castleUpgradeWindow') as UpgradeWindow;
        window.hideWindow(); 

    }

}