import { Rectangle } from '@babylonjs/gui';
import { EpicUpgradeStateChildI, MathStateI, StandardUpgradeStateChildI, StructureStateChildI } from '../../typings';
import { App } from '../app';
import { GUIPlay } from '../GUI/GUIPlay';
import { PlayMode } from '../scenes/playmode';
import { DEBUGMODE } from '../utils/CONSTANTS';
import { addStructureFlow, setSizeUpgradeBar } from '../utils/upgradeHelpers';

export class SaveState {
    private _app:App
    private _activateSave:Boolean
    private _scene:PlayMode;
    private _mathState:MathStateI;
    private _structures:StructureStateChildI[];
    private _epicUpgrades:EpicUpgradeStateChildI[];
    private _standardUpgrades:StandardUpgradeStateChildI[];
    private _fileName:string;
    private _gameSaveInt:ReturnType<typeof setInterval> | null;

    private _loadInfo:any;
    
    constructor(app:App) {
        this._app = app;
        this._activateSave = false;
        this._fileName = '';

        this._gameSaveInt = null;
    
    }

    private _saveGameInterval() {
        
        if (this._activateSave && !this._gameSaveInt) {

            this._gameSaveInt = setInterval(() => this._saveGame(), 1 * 15 * 1000);
        
        } else {
            clearInterval(this._gameSaveInt);
            this._gameSaveInt = null;
        }
    }

    private async _saveGame() {
        if (DEBUGMODE) {
            console.log('SaveGame Called');
        }


        const gameInfo = {
            fileName:this._fileName,
            mathState: {
                farmers:this._mathState.getTotalFarmers(),
                totalGold:this._mathState.getTotalGold(),
                //goldMultiplyer:this._mathState.getGoldMultiplyer(),
                totalLumens:this._mathState.getTotalLumens(),
                //wheatValue:this._mathState.getWheatValue(),
            },
            structures: [],
            standardUpgrades: [],
            epicUpgrades:[],

        }

        for (let i in this._structures) {
            const structure = this._structures[i];

            const structureInfo = {
                name: structure.getName(),
                alive: structure.getAlive(),
                steward: structure.getSteward(),
                upgradeLevel: structure.getUpgradeLevel(),
                //upgradeCostGold: structure.getUpgradeCostGold(),
                //upgradeCostFarmers: structure.getUpgradeCostFarmers(),
                //upgradeCostResources: structure.getUpgradeCostResources(),
                resource: structure.getResourceName(),
                resourceAmount: structure.getTotalResourceAmount(),
                //resourceUpgradeValue: structure.getResourceUpgradeValue(),
                //resourceMultiplyer: structure.getResourceMultiplyer(),
                //cycleTime: structure.getResourceCycleTime(),
                //goldPerCycle: structure.getGoldPerCycle(),
                //resourcePerCycle: structure.getResourcePerCycle(),
                //goldMultiplyer:structure.getGoldMultiplyer(),
            }
            
            gameInfo.structures.push(structureInfo);
            
            }
            

        for (let i in this._standardUpgrades) {
            const upgrade = this._standardUpgrades[i]

            const upgradeInfo = {
                name:upgrade.name,
                //increment:upgrade.getIncrement(),
                //effectValue:upgrade.getEffectValue(),
                //upgradeCostGold:upgrade.getCostToUpgradeGold(),
                //upgradeCostFarmers:upgrade.getCostToUpgradeFarmers(),
                //upgradeCostResources:upgrade.getCostToUpgradeResources(),
                upgradeLevel:upgrade.getCurrentUpgradeLevel(),
                //instructions:upgrade.getInstructions(),
            }

            gameInfo.standardUpgrades.push(upgradeInfo);
            }
        
        for (let i in this._epicUpgrades) {
            const upgrade = this._epicUpgrades[i];

            const upgradeInfo = {
                name:upgrade.name,
                //costToUpgrade:upgrade.getCostToUpgrade(),
                //increment:upgrade.getIncrement(),
                upgradeLevel:upgrade.getCurrentUpgradeLevel(),
                //currentValue:upgrade.getCurrentValue(),
                //instructions:upgrade.getInstructions(),
            }

                gameInfo.epicUpgrades.push(upgradeInfo);
        }

        const gameSaveJSON = JSON.stringify(gameInfo);
        
        console.log(gameSaveJSON);

        await fetch('http://localhost:3000/saveFile', {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:gameSaveJSON
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server Response', data);
        })
        .catch(error => {
            console.error('Error: ', error);
            
        })

    }

    public async loadGame() {
        if (DEBUGMODE) {
            console.log('LoadGame Called From Save State');
        }
    }

    public setActivateSave(active:boolean):void {
        this._activateSave = active;
        
        if (!active && this._gameSaveInt) {
        
            clearInterval(this._gameSaveInt);
            this._gameSaveInt = null;
        
        } else {
        
            this._saveGameInterval();
        
        }
    }
    
    public setFileName(fileName:string): void {
        this._fileName = fileName;
    }

    public setScene(scene:PlayMode):void {
        this._scene = scene as PlayMode;
        this._mathState = this._scene.mathState;
        this._structures = this._scene.allStructures;
        this._standardUpgrades = this._scene.allStandardardUpgrades;
        this._epicUpgrades = this._scene.allEpicUpgrades;
        
    };

    public setLoadInfo(info:any):void {
        this._loadInfo = info;
    }

    public getLoadInfo():any {
        return this._loadInfo;
    }

    public setGameWithSaveInfo():void {
        if (DEBUGMODE) {
            console.log("loading MathState");
            console.log(this._mathState);
        }
        
        //set the mathsate values
        this._mathState.addFarmers(this.getLoadInfo().mathState.farmers);
        this._mathState.addGold(this.getLoadInfo().totalGold);
        this._mathState.addLumens(this.getLoadInfo().mathState.totalLumens);
        
        if (DEBUGMODE) {
            console.log("loaded MathState");
            console.log(this._mathState);
        }
        
        //this._mathState.setGoldMultiplyer(this._loadInfo.mathState.goldMultiplyer);

        for (let i = 0; i <= this.getLoadInfo().structures.length -1; i++) {
            const structureFromInfo = this.getLoadInfo().structures[i];
            
            if (DEBUGMODE) { 
                console.log('saveFile structure Info:', structureFromInfo);
            }

            if (structureFromInfo.resource !== null) {
                const foundStructure = this._scene.allStructures.find((structure) => structure.getName() === structureFromInfo.name);

                foundStructure.addResource(structureFromInfo.resourceAmount);
                
                const gui = this._app.gui as GUIPlay;
                
                gui.updateStructureOnCycle(foundStructure.getResourceName(),foundStructure.getTotalResourceAmount());
            }

            if(structureFromInfo.alive) {
                const foundStructure = this._scene.allStructures.find((structure) => structure.getName() === structureFromInfo.name);
            
                if (foundStructure.getName() !== 'Farms') {
                    
                    if (structureFromInfo.steward) {
                        foundStructure.setSteward(structureFromInfo.steward);
                        const panelContainer = foundStructure.getUpgradesWindow().getPanelContainer();
                        const stewardButton = panelContainer.getChildByName('StewardButton');
                        
                        stewardButton.isEnabled = false;
                    }

                    addStructureFlow(foundStructure, true);

                    if (DEBUGMODE) {
                        console.log("structure added to game:", foundStructure);
                    }
                }

                //upgrade the structure to its saved level.
                for (let count = 0; count <= structureFromInfo.upgradeLevel; count++) {
                    foundStructure.upgradeState(true);

                    //normally the mathstate would do this as an observer to the upgrade
                    //but since we don't want to spend any gold, farmers or resources
                    //we just apply it here.
                    const newGoldMultiplyer = this._mathState.getGoldMultiplyer() + (this._mathState.getGoldMultiplyer() * foundStructure.getGoldMultiplyer()/100);
                    this._mathState.setGoldMultiplyer(newGoldMultiplyer);
                    
                    if (DEBUGMODE) {
                        console.log('structure Upgraded:', foundStructure);
                    }
                }
            }
        }

        //this needs to be set after the farm is figured out.
        this._mathState.setFarmersMax();

        if(DEBUGMODE) {
            console.log('standard Upgrades Loading');
        }
        
        //standard Upgrades
        
        for (let i = 0; i <= this._loadInfo.standardUpgrades.length -1; i++) {
            const upgradeFromInfo = this._loadInfo.standardUpgrades[i];
            const foundUpgrade = this._scene.allStandardardUpgrades.find((upgrade) => upgrade.name === upgradeFromInfo.name);
            
            if (DEBUGMODE) {
                console.log('Found Standard Upgrade:', foundUpgrade);
            }

            if (upgradeFromInfo.upgradeLevel > 0) { 
                for (let count = 0; count <= upgradeFromInfo.upgradeLevel; count++) {
                    foundUpgrade.updateState(true);
                }
            }

            if (DEBUGMODE) {
                console.log('Updated Found Standard Upgrade:', foundUpgrade);
            }
        }

        console.log('standard Upgrades Loaded:');

        //epic upgrades

        for (let i =0; i <= this._loadInfo.epicUpgrades.length -1; i++) {
            const upgradeFromInfo = this._loadInfo.epicUpgrades[i];
            const foundUpgrade = this._scene.allEpicUpgrades.find((upgrade) => upgrade.name === upgradeFromInfo.name);

            if (DEBUGMODE) {
                console.log('Found Epic Upgrade:', foundUpgrade);
            }

            if (upgradeFromInfo.upgradeLevel > 0) {
                for (let count = 0; count<= upgradeFromInfo.upgradeLevel; count ++) {
                    foundUpgrade.updateState();
                }
            }

        }
    }
}
