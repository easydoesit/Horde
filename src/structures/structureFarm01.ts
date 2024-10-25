import { StructureStateChildI } from "../../typings";
import { StructureUpgradeSection } from "../GUI/structureUpgrades/structureUpgradeSection";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE, farm01} from "../utils/CONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { StructureState } from "./structureState";
import { checkUpgradeFarmersMax, farmUpgradeCallBack, farmUpgradeAllowed } from "../utils/upgradeHelpers";
import { FarmUpgradeWindow } from "../GUI/farmUpgrades/farmUpgradeWindow";

export class StructureFarm01 extends StructureState implements StructureStateChildI {

    constructor(scene:PlayMode){
        super(scene);
        this._name = farm01.name;
        this._character = farm01.character;
        this._animationPaths = farm01.paths;
        this._upgradeMax = farm01.upgradeMax;
        this._upgradeCostGold = farm01.nextUpgradeCostInGold(this.getUpgradeLevel());
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, farm01.models, farm01.clickbox, farm01.gamePos);
        console.log(farm01.gamePos);
        console.log(this._structureModels.position);
        this._upgradesWindow = new FarmUpgradeWindow(`Farm Upgrades`, this._scene);
        this._upgradeSection = new StructureUpgradeSection('1st Farm Upgrades', `next Upgrade allows ${checkUpgradeFarmersMax(this)} farmers on your 1st farm`, this, () => {farmUpgradeCallBack(this)})
        this._addStructureButton = null;
        this._addUpgradePanel();
        
        this._moveStructuresToGamePosition();

        this._scene.onBeforeRenderObservable.add(() => {
        
            this.getUpgradeSection().upgradeAble = farmUpgradeAllowed(this);
        
        });

        this.upgradeState();
        this.getUpgradeSection().changeGoldCost(this._upgradeCostGold);
        
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
            console.log(`${this._name} upgradeLevel on Call:`, this._upgradeLevel);

            this.notifyObserversOnUpgrade();

            this.getUpgradeSection().changeInstruction(`Next upgrade allows ${checkUpgradeFarmersMax(this)} farmers on your 1st farm`);

            this._upgradeCostGold = farm01.nextUpgradeCostInGold(this._upgradeLevel);
            
        }
    
    }
    
}