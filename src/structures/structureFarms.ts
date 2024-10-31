import { StructureStateChildI } from "../../typings";
import { StructureUpgradeSection } from "../GUI/structureUpgrades/structureUpgradeSection";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { castleToFarmPaths, DEBUGMODE, farms} from "../utils/CONSTANTS";
import { debugUpgradeState } from "../utils/structuresHelpers";
import { StructureState } from "./structureState";
import { checkUpgradeFarmersMax, farmsUpgradeCallBack, farmUpgradeAllowed, farmAdditionAllowed } from "../utils/upgradeHelpers";
import { FarmUpgradeWindow } from "../GUI/farmUpgrades/farmUpgradeWindow";
import { Vector3 } from "@babylonjs/core";
import { AddFarmButton } from "../GUI/farmUpgrades/addFarmButton";

export type farmsT = {
    name:string;
    gamePos:Vector3, 
    housePos:Vector3, 
    models:StructureModel, 
    upgradeSectionInstructions:string, 
    upgradeSection:StructureUpgradeSection | null,
    addStructureButton:AddFarmButton| null,
    upgradeLevel:number;
    upgradeMax:number;
    alive:boolean;
}

export class StructureFarms extends StructureState implements StructureStateChildI {
    private _farm01:farmsT;
    private _farm02:farmsT;
    private _farm03:farmsT;
    private _farm04:farmsT;
    private _allFarms:farmsT[]

    constructor(scene:PlayMode){
        super(scene);
        this._name = farms.name;
        this._character = farms.character;
        this._animationPaths = castleToFarmPaths;
        this._upgradeMax = farms.upgradeMax;
        this._upgradeCostGold = farms.nextUpgradeCostInGold(this.getUpgradeLevel());
        console.log('farms upgrade cost in gold', this._upgradeCostGold);
        this._upgradeCostFarmers = farms.nextUpgradeCostInFarmers(this.getUpgradeLevel());
        this._upgradeCostResources = farms.nextUpgradeCostInResources(this.getUpgradeLevel());
        this._upgradesWindow = new FarmUpgradeWindow(`Farm Upgrades`, this._scene);
        this._addStructureButton = null;

        this._allFarms=[];

        this._farm01 ={
            name:'1st farm',
            gamePos:farms.otherProps.farm01.gamePos,
            housePos:farms.otherProps.farm01.housePos,
            models:new StructureModel('Farm01_models', this._scene, farms.models, farms.clickbox, farms.otherProps.farm01.gamePos),
            upgradeSectionInstructions: `next Upgrade allows ${checkUpgradeFarmersMax(this).toFixed()} farmers on your 1st farm`,
            upgradeSection:null,
            addStructureButton:null,
            upgradeLevel:0,
            upgradeMax:this.getUpgradeMax() / 4,
            alive:true
        }

        this._farm02 ={
            name:'2nd farm',
            gamePos:farms.otherProps.farm02.gamePos,
            housePos:farms.otherProps.farm02.housePos,
            models:new StructureModel('Farm02_models', this._scene, farms.models, farms.clickbox, farms.otherProps.farm02.gamePos),
            upgradeSectionInstructions: `next Upgrade allows ${checkUpgradeFarmersMax(this).toFixed()} farmers on your 2nd farm`,
            upgradeSection:null,
            addStructureButton:null,
            upgradeLevel:0,
            upgradeMax:this.getUpgradeMax() / 4,
            alive:false
        }

        this._farm03 ={
            name:'3rd farm',
            gamePos:farms.otherProps.farm03.gamePos,
            housePos:farms.otherProps.farm03.housePos,
            models:new StructureModel('Farm02_models', this._scene, farms.models, farms.clickbox, farms.otherProps.farm03.gamePos),
            upgradeSectionInstructions: `next Upgrade allows ${checkUpgradeFarmersMax(this).toFixed()} farmers on your 3rd farm`,
            upgradeSection: null,
            addStructureButton: null,
            upgradeLevel:0,
            upgradeMax:this.getUpgradeMax() / 4,
            alive:false
        }

        this._farm04 ={
            name:'4th farm',
            gamePos:farms.otherProps.farm04.gamePos,
            housePos:farms.otherProps.farm04.housePos,
            models:new StructureModel('Farm02_models', this._scene, farms.models, farms.clickbox, farms.otherProps.farm03.gamePos),
            upgradeSectionInstructions: `next Upgrade allows ${checkUpgradeFarmersMax(this).toFixed()} farmers on your 4th farm`,
            upgradeSection: null,
            addStructureButton: null,
            upgradeLevel:0,
            upgradeMax:this.getUpgradeMax() / 4,
            alive:false
        }

        this._farm01.upgradeSection = new StructureUpgradeSection('1st Farm Upgrades', this,  () => {farmsUpgradeCallBack(this._farm01, this)});
        this._farm02.upgradeSection = new StructureUpgradeSection('1st Farm Upgrades', this,  () => {farmsUpgradeCallBack(this._farm02, this)});
        this._farm03.upgradeSection = new StructureUpgradeSection('1st Farm Upgrades', this,  () => {farmsUpgradeCallBack(this._farm03, this)});
        this._farm04.upgradeSection = new StructureUpgradeSection('1st Farm Upgrades', this,  () => {farmsUpgradeCallBack(this._farm04, this)});

        this._farm02.addStructureButton =  new AddFarmButton('Farm 2', this.getFarm02(), this.getFarm03(), this, this.getScene());
        this._farm03.addStructureButton =  new AddFarmButton('Farm 3', this.getFarm03(), this.getFarm04(), this, this.getScene());
        this._farm04.addStructureButton =new AddFarmButton('Farm 4', this.getFarm04(), null, this, this.getScene());

        this._allFarms.push(this._farm01, this._farm02, this._farm03, this._farm04);

        this.getFarm01().models.position = this.getFarm01().gamePos;

        const farm02pos = this.getFarm02().gamePos;
        this.getFarm02().models.position = new Vector3(farm02pos.x, farm02pos.y - 20, farm02pos.z);
        
        const farm03pos = this.getFarm03().gamePos;
        this.getFarm03().models.position = new Vector3(farm03pos.x, farm03pos.y - 20, farm03pos.z);

        const farm04pos = this.getFarm04().gamePos;
        this.getFarm04().models.position  = new Vector3(farm04pos.x, farm04pos.y - 20, farm04pos.z);

        for (let i in this._allFarms) {
            const farm = this._allFarms[i];

            farm.upgradeSection.changeInstructions(farm.upgradeSectionInstructions);
            farm.upgradeSection.changeMaxNumUpgrades(this.getUpgradeMax()/this.getAllFarms().length);
        
        }

        this._scene.onBeforeRenderObservable.add(() => {
        
            for (let i in this._allFarms) {
                const farm = this._allFarms[i] 
                
                if (farm.addStructureButton !== null) {
                    farmAdditionAllowed(farm, this);
                }
                farm.upgradeSection.upgradeAble = farmUpgradeAllowed(this);
            }
                
        });
        
    }

    public upgradeState(): void {
        if (DEBUGMODE) {
            debugUpgradeState(this._name, this.getUpgradeLevel());
        }

        this._upgradeLevel += 1;
        this._goldMultiplyer = farms.goldMultiplyer(this.getNextUpgradeLevel(), this.getUpgradeMax());
        (this.getUpgradesWindow() as FarmUpgradeWindow).changeFarmersMaxText(this.getScene().mathState.getFarmersMax().toFixed());

        this.setUpgradeCostGold(farms.nextUpgradeCostInGold(this._upgradeLevel));
        
        this.notifyObserversOnUpgrade();
        
        let amountAlive = 0;
        
        for (let i in this._allFarms) {
            const farm = this._allFarms[i];

            if (farm.alive === true) {
                amountAlive += 1;
            }
            
        }
        
        for (let i in this._allFarms) {
            const farm = this._allFarms[i];
            farm.upgradeSectionInstructions = `Next Upgrade allows ${(this.getScene().mathState.getFarmersMax()/amountAlive).toFixed()} farmers on ${farm.name}`;
            farm.upgradeSection.changeInstructions(farm.upgradeSectionInstructions);
            farm.upgradeSection.changeGoldCost(this.getUpgradeCostGold());
            
            if (farm.addStructureButton !== null) {
                farm.addStructureButton.setGoldCostText(`Cost Gold: ${this.getUpgradeCostGold().toFixed()}`);
            }

        }
        
    }

    public getFarm01():farmsT {
        return this._farm01;
    }

    public getFarm02():farmsT {
        return this._farm02;
    }

    public getFarm03():farmsT {
        return this._farm03;
    }

    public getFarm04():farmsT {
        return this._farm04;
    }

    public getAllFarms():farmsT[] {
        return this._allFarms
    } 
  
}