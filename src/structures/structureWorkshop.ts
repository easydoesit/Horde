import { StructureStateChildI } from "../../typings";
import { GUIPlay } from "../GUI/GUIPlay";
import { InSceneStuctureGUI } from "../GUI/inSceneStructureGUI";
import { AddStructureButton } from "../GUI/structureUpgrades/addStructureButton";
import { StructureUpgradeSection } from "../GUI/structureUpgrades/structureUpgradeSection";
import { UpgradeWindow } from "../GUI/upgradeWindow";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE, farmToWorkShopPaths, workShopClickBox, workShopModels, workShopPos, } from "../utils/CONSTANTS";
import { goldBarPerCycle, goldBarUpgradeValue, timeToMakeGoldBar, timeToMakeRelic, workShopCreateGoldAmount, workShopUpgradeCostFarmers, workShopUpgradeCostGold, workShopUpgradeMax } from "../utils/MATHCONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { structureUpgradeAllowed } from "../utils/upgradeHelpers";
import { StructureState } from "./structureState";

export class StructureWorkShop extends StructureState implements StructureStateChildI {
    constructor(scene:PlayMode) {
        super(scene);
        this._name = 'Workshop';
        this._character = 'alchemist';
        this._animationPaths = farmToWorkShopPaths;
        this._upgradeMax = workShopUpgradeMax;
        this._upgradeCostGold = Math.round(workShopUpgradeCostGold(this.getUpgradeLevel())*1000/1000);
        this._upgradeCostFarmers = Math.round(workShopUpgradeCostFarmers(this.getUpgradeLevel()));
        this._product = 'Goldbars';
        this._cycleTime = timeToMakeRelic(this.getUpgradeLevel());
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, workShopModels, workShopClickBox, workShopPos);
        this._goldPerCycle = workShopCreateGoldAmount;
        this._productAmountPerCycle = goldBarPerCycle;
        this._inSceneGui = new InSceneStuctureGUI('WorkShopSceneGui', this, 'Goldbars');
        this._upgradesWindow = new UpgradeWindow('WorkShopUpgradeWindow')
        this._upgradeSection = new StructureUpgradeSection('WorkShopUpgradeSection', `Speeds Up GoldBar Creation by ${goldBarUpgradeValue * 100}%`, this, () => {this._workShopUpgradeCallback()})
        this._addStructureButton = new AddStructureButton('addWorkShopButton', this, () => {this._workShopAdditionCallback()})
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

            this._upgradeLevel += 1;
            this._cycleTime = timeToMakeGoldBar(this.getUpgradeLevel());
      
            //update the observers
            this.notifyObserversOnUpgrade();

            this._upgradeCostFarmers = workShopUpgradeCostFarmers(this.getUpgradeLevel());

            this._upgradeCostGold = Math.round(workShopUpgradeCostGold(this.getUpgradeLevel())*1000)/1000;

        }
    }   

    private _workShopUpgradeCallback() {
        if (DEBUGMODE) {
            console.log('WorkShopUpgradeChangeCalled');
        }
        
        //upgrade the State
        this.upgradeState();

        this._upgradeSection.changeGoldCost(this.getUpgradeCostGold());
        this._upgradeSection.changeFarmerCost(this.getUpgradeCostFarmers());

    }

    private _workShopAdditionCallback() {
        if (DEBUGMODE) {
            console.log('addWorkshopCalled');
            
        }   
        const window = (this._scene.getAppGui() as GUIPlay).getUpgradeWindow('castleUpgradeWindow') as UpgradeWindow;
        window.hideWindow(); 
    }
}