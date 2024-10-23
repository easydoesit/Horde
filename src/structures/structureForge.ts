import { StructureStateChildI } from "../../typings";
import { GUIPlay } from "../GUI/GUIPlay";
import { InSceneStuctureGUI } from "../GUI/inSceneStructureGUI";
import { AddStructureButton } from "../GUI/structureUpgrades/addStructureButton";
import { StructureUpgradeSection } from "../GUI/structureUpgrades/structureUpgradeSection";
import { UpgradeWindow } from "../GUI/upgradeWindow";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE, farmToForgePaths, forgeClickBox, forgeModels, forgePos } from "../utils/CONSTANTS";
import { forgeGoldPerCycle, forgeUpgradeCostFarmers, forgeUpgradeCostGold, forgeUpgradeMax, timeToMakeWeapon, weaponPerCycle, weaponUpgradeValue } from "../utils/MATHCONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { structureUpgradeAllowed } from "../utils/upgradeHelpers";
import { StructureState } from "./structureState";

export class StructureForge extends StructureState implements StructureStateChildI {
    constructor(scene:PlayMode) {
        super(scene);
        this._name = 'Forge';
        this._character = 'blacksmith';
        this._animationPaths = farmToForgePaths;
        this._upgradeMax = forgeUpgradeMax;
        this._upgradeCostGold = Math.round(forgeUpgradeCostGold(this.getUpgradeLevel())*1000/1000);
        this._upgradeCostFarmers = Math.round(forgeUpgradeCostFarmers(this.getUpgradeLevel()));
        this._product = 'Weapons';
        this._cycleTime = timeToMakeWeapon(this.getUpgradeLevel());
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, forgeModels, forgeClickBox, forgePos);
        this._goldPerCycle = forgeGoldPerCycle;
        this._productAmountPerCycle = weaponPerCycle;
        this._inSceneGui = new InSceneStuctureGUI('ForgeSceneGui', this,'Weapons');
        this._upgradesWindow = new UpgradeWindow('ForgeUpgradeWindow');
        this._upgradeSection = new StructureUpgradeSection('ForgeUpgradeSection', `Speeds Up Weapon Production by ${weaponUpgradeValue * 100}%`, this, () => {this._forgeUpgradeCallback()});
        this._addStructureButton = new AddStructureButton('addForgeButton', this, () => {this._forgeAdditionCallback()});
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
            this._cycleTime = timeToMakeWeapon(this.getUpgradeLevel());
      
            //update the observers
            this.notifyObserversOnUpgrade();

            this._upgradeCostFarmers = forgeUpgradeCostFarmers(this.getUpgradeLevel());

            this._upgradeCostGold = Math.round(forgeUpgradeCostGold(this.getUpgradeLevel())*1000)/1000;

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