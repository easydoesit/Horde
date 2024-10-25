import { StructureStateChildI } from "../../typings";
import { AddStructureButton } from "../GUI/structureUpgrades/addStructureButton";
import { StructureUpgradeSection } from "../GUI/structureUpgrades/structureUpgradeSection";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE, farm04 } from "../utils/CONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { checkUpgradeFarmersMax, farmAdditionAllowed, farmAdditionCallback, farmUpgradeAllowed, farmUpgradeCallBack } from "../utils/upgradeHelpers";
import { StructureState } from "./structureState";

export class StructureFarm04 extends StructureState implements StructureStateChildI {
    
    constructor(scene:PlayMode){
        super(scene);
        this._name = farm04.name;
        this._character = farm04.character;
        this._animationPaths = farm04.paths;
        this._upgradeMax = farm04.upgradeMax;
        this._upgradeCostGold = farm04.nextUpgradeCostInGold(this.getUpgradeLevel());
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, farm04.models, farm04.clickbox, farm04.gamePos);
        this._upgradesWindow = this._scene.farm01.getUpgradesWindow();//shared Window
        this._upgradeSection = new StructureUpgradeSection('4th Farm Upgrades', `next Upgrade allows ${checkUpgradeFarmersMax(this)} farmers on your 4th farm`, this, () => {farmUpgradeCallBack(this)});
        this._addStructureButton = new AddStructureButton('Farm 4', this, () => {farmAdditionCallback(this, null)});
        this._addUpgradePanel();
        
        this._upgradeSection.isVisible = false;

        this._moveStructuresToGamePosition();

        this._scene.onBeforeRenderObservable.add(() => {
        
            this.getUpgradeSection().upgradeAble = farmUpgradeAllowed(this);
            farmAdditionAllowed(this);
        })
    }

    public upgradeState() {
            
        if (DEBUGMODE) {
            debugUpgradeState(this._name, this.getUpgradeLevel());
        }
        
        if (this.getUpgradeLevel() < this.getUpgradeMax()) {
            //change the structures
            switch(this._upgradeLevel) {
                case 1 :  {
                    this._structureModels.hideModel(0);
                    this._structureModels.showModel(1);
                }
                break;
            }

            this._upgradeLevel += 1;

            this.notifyObserversOnUpgrade();

            this.getUpgradeSection().changeInstruction(`Next upgrade allows ${checkUpgradeFarmersMax(this)} farmers on your 4th farm`);

            this._upgradeCostGold = farm04.nextUpgradeCostInGold(this._upgradeLevel);

        }

    }
    
}