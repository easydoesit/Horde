import { StructureStateChildI } from "../../typings";
import { StructureUpgradeSection } from "../GUI/structureUpgrades/structureUpgradeSection";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { castleToFarmPaths, DEBUGMODE, farms} from "../utils/CONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { StructureState } from "./structureState";
import { checkUpgradeFarmersMax } from "../utils/upgradeHelpers";
import { structureUpgradeAllowed } from "../utils/upgradeHelpers";
import { Vector3 } from "@babylonjs/core";
import { UpgradeWindow } from "../GUI/upgradeWindow";

export class StructureFarms extends StructureState implements StructureStateChildI {
    private _houseLocations:Vector3[];
    
    constructor(scene:PlayMode){
        super(scene);
        this._name = farms.name;
        this._character = farms.character;

        this._initGoldCost = farms.initCosts.gold;
        this._initFarmerCost = farms.initCosts.farmers;
        this._initResourceCost = farms.initCosts.resources;
        this._initResource = farms.initCosts.resourceName;
        this._animationPaths = castleToFarmPaths;
        this._upgradeMax = farms.upgradeMax;
        this._upgradeCostGold = farms.nextUpgradeCostInGold(this.getUpgradeLevel());
        this._upgradeCostFarmers = farms.nextUpgradeCostInFarmers(this.getUpgradeLevel());
        this._structureModels = new StructureModel(`${this._name}_models`, this._scene, farms.models, farms.clickbox, farms.gamePos);    
        this._upgradesWindow = new UpgradeWindow('farmUpgradeWindow');
        this._upgradeSectionInstructions = `next Upgrade allows ${checkUpgradeFarmersMax(this).toFixed()} farmers on your farm's`;
        this._upgradeSection = new StructureUpgradeSection('Farm Upgrades', this, () => {this._farmsUpgradeCallback()});
        this._addStructureButton = null;
        this._alive = true;
        this._resource = null;
        this._houseLocations = farms.otherProps.housePositions;

        this._addUpgradePanel();

        this.moveStructuresToGamePosition();

        this._scene.onBeforeRenderObservable.add(() => {

            this.getUpgradeSection().upgradeAble = structureUpgradeAllowed(this);

        })
        
    }

    public upgradeState(loadingSave:boolean): void {
        if (DEBUGMODE) {
            debugUpgradeState(this._name, this.getUpgradeLevel());
        }

        this._upgradeLevel += 1;
        this._goldMultiplyer = farms.goldMultiplyer(this.getUpgradeLevel(), this.getUpgradeMax());
        this.setUpgradeSectionInstructions(`next Upgrade allows ${checkUpgradeFarmersMax(this).toFixed()} farmers on your farm's`);

        this.setUpgradeCostGold(farms.nextUpgradeCostInGold(this._upgradeLevel));
        
        if (!loadingSave) {
            this.notifyObserversOnUpgrade();
        }

        this.setModels();
        
    }

    private _reset():void {
        this._upgradeCostGold = farms.nextUpgradeCostInGold(this.getUpgradeLevel());
        this._upgradeCostFarmers = farms.nextUpgradeCostInFarmers(this.getUpgradeLevel());
        this._upgradeCostResources = farms.nextUpgradeCostInResources(this.getUpgradeLevel());
        this._goldMultiplyer = farms.goldMultiplyer(this.getUpgradeLevel(), this.getUpgradeMax());  
        this.setUpgradeCostGold(farms.nextUpgradeCostInGold(this._upgradeLevel));

        this.notifyObserversOnUpgrade();

        this.setModels();

        this._upgradeSection.reset();

    }

    private _farmsUpgradeCallback() {
        if (DEBUGMODE) {
            console.log('Farms Upgrade Called');
        }

        this.upgradeState(false);

        this.getUpgradeSection().setGoldCost(this.getUpgradeCostGold());

    }

    protected _kingdomResetUnique() {
        //overide in child class as it is for any special changes.
        if (DEBUGMODE) {
            console.log(`Called _kingdomResetUnique() for ${this.getName()} child structure class.`);
        }

        this._reset();
    }

    public setModels(): void {
        
        if (this.getUpgradeLevel() < this.getUpgradeMax()) {
            for (let i = 0; i <= this._structureModels.models.length - 1; i++) {
                this._structureModels.hideModel(i);
            }

            //set the structures
            switch(this.getUpgradeLevel()) {

                case 0 : {

                    this._structureModels.showModel(0);
                }
                break;
                case 1 :  {
                    this._structureModels.showModel(1);
                }
                break;

                case 2 :  {
                    this._structureModels.showModel(2);
                }
                break;

                case 3 :  {
                    this._structureModels.showModel(3);
                }
                break;

                case 4 :  {
                    this._structureModels.showModel(4);
                }
                break;

                case 5 :  {
                    this._structureModels.showModel(5);
                }
                break;

                case 6 :  {
                    this._structureModels.showModel(6);
                }
                break;

                case 7 :  {
                    this._structureModels.showModel(7);
                }
                break;

                default: {
                    console.error(`No models for ${this.getName()} at Level ${this.getUpgradeLevel()}. Get the Art Team to work`);
                }
                break;
            }

        }
        
    }

    public getLiveHouseLocations():Vector3[] {
        const liveHouseLocations = []; 
        for (let count = 0; count <= this._upgradeLevel; count++){
            liveHouseLocations.push(this._houseLocations[count]);
        }
        return liveHouseLocations;
    }
  
}