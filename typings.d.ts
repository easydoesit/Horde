import { FarmState } from "./src/gameControl/farmState";
import { MineState } from "./src/gameControl/mineState";
import { StructureModel } from "./src/models_structures/structureModels";

export type GameStateT = 'START_SCREEN' |'PLAY_MODE' | 'END_SCREEN';

export interface IStateCallback {
    setOnStateChangeCallback(callback:() => void):void;
}

export interface GameStateI {
    state:GameStateT;
    attach(gameStateObserver:GameStateObserverI):void;
    detach(gameStateObserver:GameStateObserverI):void;
    notify():void;
    setGameState(gameState:GameStateT):void;
}

export interface GameStateObserverI {
    name:string;
    updateGameState(gamestate:GameStateI):void;
}

export interface MathStateI {
    totalGold:number;
    goldPerSecond:number;
    totalLumens:number;
    totalFarmers:number;
    runningFarmers:number;
    farmersMax:number;
    wheatValue:number;
    costOfWheat:number;
    wheatUpgrades:number;
    farmState01:FarmState;
    farmState02:FarmState;
    farmState03:FarmState;
    farmState04:FarmState;
    farmStates:FarmState[];
    totalOre:number;
    costOfOreGold:number;
    timeToMakeOre:number;
    mineState:MineState;
    attach(observer:MathStateObserverI):void;
    detach(observer:MathStateObserverI):void;
    notify():void;
    makeFarmerRun(number:number):void;
    endFarmerRun():void;
    addFarmers(number:number):void;
    spendFarmers(amount:number):void;
    changeFarmersMax():void;
    changeGoldPerSecond():number;
    addLumens(amount:number):void;
    spendLumens(amount:number):void;
    addGold(amount:number):void;
    spendGold(amount:number):void;
    upgradeWheat():void;
    changeCostOfWheat():void;
    changeWheatValue():void;
}

export interface MathStateObserverI { 
    name:string;
    updateMathState(mathstate:MathStateI):void;//subscribe to whatever you want
}

export interface StructureI {
    name:string;
    upgradeCostFarmers:number;
    upgradeCostGold: number;
    upgradeLevel:number;
    timeToMakeWeapon:number;
    structureModels:StructureModel;
    
    attach(observer:StructureObserverI):void;
    detach(observer:StructureObserverI):void;
    notify():void;
    upgradeState():void;
    
}

export interface StructureObserverI {
    name:string;
    updateStructure(structure:StructureI):void;
}