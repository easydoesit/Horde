import { StructureStateChildI } from "../../typings";
import { AddStructureButton } from "../GUI/structureUpgrades/addStructureButton";
import { StructureUpgradeSection } from "../GUI/structureUpgrades/structureUpgradeSection";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE, farm02 } from "../utils/CONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { checkUpgradeFarmersMax, farmUpgradeAllowed, farmUpgradeCallBack, farmAdditionCallback, farmAdditionAllowed } from "../utils/upgradeHelpers";
import { StructureState } from "./structureState";

export class StructureFarm02 extends StructureState implements StructureStateChildI {
    
    constructor(scene:PlayMode){
        super(scene);
        this._name = farm02.name;
        this._character = farm02.character;
        this._animationPaths = farm02.paths;
        this._upgradeMax = farm02.upgradeMax;
        this._upgradeCostGold = farm02.nextUpgradeCostInGold(this.getUpgradeLevel());
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, farm02.models, farm02.clickbox, farm02.gamePos);
        console.log(farm02.gamePos);
        console.log(this._structureModels.position);
        this._upgradesWindow = this._scene.farm01.getUpgradesWindow();//shared Window
        this._upgradeSection = new StructureUpgradeSection('2nd Farm Upgrades', `next Upgrade allows ${checkUpgradeFarmersMax(this)} farmers on your 2nd farm`, this, () => {farmUpgradeCallBack(this)})
        this._addStructureButton = new AddStructureButton('Farm 2', this, () => {farmAdditionCallback(this, this._scene.farm03.getAddStructureButton())});
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
            debugUpgradeState(this._name, this._upgradeLevel);
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

            this.getUpgradeSection().changeInstruction(`Next upgrade allows ${checkUpgradeFarmersMax(this)} farmers on your 2nd farm`);
            
            this._upgradeCostGold = farm02.nextUpgradeCostInGold(this._upgradeLevel);

        }

    }

}