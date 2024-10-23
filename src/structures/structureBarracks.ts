import { StructureStateChildI } from "../../typings";
import { AddStructureButton } from "../GUI/structureUpgrades/addStructureButton";
import { InSceneStuctureGUI } from "../GUI/inSceneStructureGUI";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { barracksClickBox, barracksModels, barracksPos, DEBUGMODE, farmToBarracksPaths } from "../utils/CONSTANTS";
import { barracksGoldPerCycle, barracksUpgradeCostFarmers, barracksUpgradeCostGold, barracksUpgradeMax, timeToMakeVillage, villagePerCycle, villagesUpgradeValue } from "../utils/MATHCONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { StructureState } from "./structureState";
import { UpgradeWindow } from "../GUI/upgradeWindow";
import { StructureUpgradeSection } from "../GUI/structureUpgrades/structureUpgradeSection";
import { GUIPlay } from "../GUI/GUIPlay";
import { structureUpgradeAllowed } from "../utils/upgradeHelpers";

export class StructureBarracks extends StructureState implements StructureStateChildI {
    constructor(scene:PlayMode) {
        super(scene);
        this._name = 'Barracks';
        this._character = 'soldier';
        this._animationPaths = farmToBarracksPaths;
        this._upgradeMax = barracksUpgradeMax;
        this._upgradeCostGold = Math.round(barracksUpgradeCostGold(this.getUpgradeLevel())*1000/1000);
        this._upgradeCostFarmers = Math.round(barracksUpgradeCostFarmers(this.getUpgradeLevel()));
        this._product = 'Villages';
        this._cycleTime = timeToMakeVillage(this.getUpgradeLevel());
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, barracksModels, barracksClickBox, barracksPos);
        this._goldPerCycle = barracksGoldPerCycle;
        this._productAmountPerCycle = villagePerCycle;
        this._inSceneGui = new InSceneStuctureGUI('BarracksSceneGui', this, 'Villages');
        this._upgradesWindow = new UpgradeWindow('BarracksUpgradeWindow');
        this._upgradeSection = new StructureUpgradeSection('BarrackUpgradeSection', `Speeds Up Village Capture by ${villagesUpgradeValue * 100}%`, this, () => {this._barracksUpgradeCallback()});
        this._addStructureButton = new AddStructureButton('addBarracksButton', this, () => {this._barracksAdditionCallback()});
        this._addUpgradePanel();

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
            this._cycleTime = timeToMakeVillage(this.getUpgradeLevel());
      
            //update the observers
            this.notifyObserversOnUpgrade();

            this._upgradeCostFarmers = barracksUpgradeCostFarmers(this.getUpgradeLevel());
            this._upgradeCostGold = Math.round(barracksUpgradeCostGold(this.getUpgradeLevel())*1000)/1000;

        }
    }

    private _barracksUpgradeCallback() {
        if (DEBUGMODE) {
            console.log('barracksUpgradeChangeCalled');
        }
        
        //upgrade the State
        this.upgradeState();

        this._upgradeSection.changeGoldCost(this.getUpgradeCostGold());
        this._upgradeSection.changeFarmerCost(this.getUpgradeCostFarmers());


    }

    private _barracksAdditionCallback() {
        if (DEBUGMODE) {
            console.log('addBarracksCalled');
        }     

        const window = (this._scene.getAppGui() as GUIPlay).getUpgradeWindow('castleUpgradeWindow') as UpgradeWindow;
        window.hideWindow(); 
    }

}