import { EpicUpgradeStateChildI, MathStateI, StandardUpgradeStateChildI, StructureStateChildI } from '../../typings';
import { App } from '../app';
import { GUIPlay } from '../GUI/GUIPlay';
import { PlayMode } from '../scenes/playmode';
import { DEBUGMODE } from '../utils/CONSTANTS';

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
            mathstate: {
                farmers:this._mathState.getTotalFarmers(),
                totalGold:this._mathState.getTotalGold(),
                goldMultiplyer:this._mathState.getGoldMultiplyer(),
                totalLumens:this._mathState.getTotalLumens(),
                wheatValue:this._mathState.getWheatValue(),
            },
            structures: [],
            standardUpgrades: [],
            epicUpgrades:[],

        }

        for (let i in this._structures) {
            const structure = this._structures[i];

            if (structure.getAlive()) {
                const structureInfo = {
                    name: structure.getName(),
                    alive: structure.getAlive(),
                    steward: structure.getSteward(),
                    upgradeLevel: structure.getUpgradeLevel(),
                    upgradeCostGold: structure.getUpgradeCostGold(),
                    upgradeCostFarmers: structure.getUpgradeCostFarmers(),
                    upgradeCostResources: structure.getUpgradeCostResources(),
                    resource: structure.getResourceName(),
                    resourceAmount: structure.getTotalResourceAmount(),
                    resourceUpgradeValue: structure.getResourceUpgradeValue(),
                    resourceMultiplyer: structure.getResourceMultiplyer(),
                    cycleTime: structure.getResourceCycleTime(),
                    goldPerCycle: structure.getGoldPerCycle(),
                    resourcePerCycle: structure.getResourcePerCycle(),
                    goldMultiplyer:structure.getGoldMultiplyer(),
                }
            
            gameInfo.structures.push(structureInfo);
            
            }
            
        }

        for (let i in this._standardUpgrades) {
            const upgrade = this._standardUpgrades[i]

            if (upgrade.getCurrentUpgradeLevel() > 0) {
                const upgradeInfo = {
                    name:upgrade.name,
                    increment:upgrade.getIncrement(),
                    effectValue:upgrade.getEffectValue(),
                    upgradeCostGold:upgrade.getCostToUpgradeGold(),
                    upgradeCostFarmers:upgrade.getCostToUpgradeFarmers(),
                    upgradeCostResources:upgrade.getCostToUpgradeResources(),
                    upgradeLevel:upgrade.getCurrentUpgradeLevel(),
                    instructions:upgrade.getInstructions(),
                }

                gameInfo.standardUpgrades.push(upgradeInfo);
            }
        }
        
        for (let i in this._epicUpgrades) {
            const upgrade = this._epicUpgrades[i];

            if (upgrade.getActive()) {
                const upgradeInfo = {
                    name:upgrade.name,
                    costToUpgrade:upgrade.getCostToUpgrade(),
                    increment:upgrade.getIncrement(),
                    upgradeLevel:upgrade.getCurrentUpgradeLevel(),
                    currentValue:upgrade.getCurrentValue(),
                    instructions:upgrade.getInstructions(),
                }

                gameInfo.epicUpgrades.push(upgradeInfo);
            }
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
        this._mathState.addFarmers(this._loadInfo.mathstate.farmers);
        this._mathState.addGold(this._loadInfo.mathstate.totalGold);
        this._mathState.addLumens(this._loadInfo.mathstate.totalLumens);

        for (let i = 0; i <= this._loadInfo.structures.length -1; i++) {
            const structureFromInfo = this._loadInfo.structures[i];
            console.log(structureFromInfo);
            if (structureFromInfo.resource !== null) {
                const foundStructure = this._scene.allStructures.find((structure) => structure.getName() === structureFromInfo.name);

                foundStructure.addResource(structureFromInfo.resourceAmount);
                
                const gui = this._app.gui as GUIPlay;
                
                gui.updateStructureOnCycle(foundStructure.getResourceName(),foundStructure.getTotalResourceAmount());
                console.log(foundStructure);

            }

        //     if(structureFromInfo.alive) {
        //         const foundStructure = this._scene.allStructures.find((structure) => structure.getName() === structureFromInfo.name);
        //         foundStructure.setUpgradeLevel(structureFromInfo.upgradeLevel);
        //         foundStructure.upgradeState();

        //     }
        }



    }
}
