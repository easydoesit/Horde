import { StructureModel } from "./src/models_structures/structureModels";
import { Rectangle, TextBlock } from "@babylonjs/gui";


export type GameStateT = 'START_SCREEN' |'PLAY_MODE' | 'END_SCREEN';

export type ProductsT = 'Ore' | 'Weapons' | 'Villages' | 'Loot' | 'Goldbars' | 'Portals' | 'Relics';

export type StructureCharactersT = 'farmer' | 'miner' | 'blacksmith' | 'soldier' | 'thief' | 'alchemist' | 'wizard' | 'adventurer';

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
    wheatValue:number;
    costOfWheatUpgrade:number;
    wheatUpgrades:number;

    attach(observer:MathStateObserverI):void;
    detach(observer:MathStateObserverI):void;
    notify():void;

    getTotalLumens():number;
    addLumens(amount:number):void;
    spendLumens(amount:number):void;

    getFarmersMax():number;
    getTotalFarmers():number;
    makeFarmerRun(number:number):void;
    endFarmerRun():void;
    getRunningFarmers():number;
    addFarmers(number:number):void;
    spendFarmers(amount:number):void;
    changeFarmersMax():void;
    
    changeGoldPerSecond():number;
    getGoldPerSecond():number;
    addGold(amount:number):void;
    spendGold(amount:number):void;
    getTotalGold():number;

    upgradeWheat():void;
    changeCostOfWheatUpgrade():void;
    changeWheatValue():void;
   
    addProduct(product:ProductsT, amount:number):void;
    removeProduct(product:ProductsT, amount:number):void;
    getTotalProductAmount(product:ProductsT):number;
}

export interface MathStateObserverI { 
    name:string;
    updateMathState(mathstate:MathStateI):void;//subscribe to whatever you want
}

export interface StructureStateI {
    name:string;

    attach(observer:StructureStateObserverI):void;
    detach(observer:StructureStateObserverI):void;
    notify():void;
    
    getUpgradeCostFarmers():number;
    getUpgradeCostGold():number;
    getUpgradeLevel():number;
    getProduct():ProductsT | null;
    getTimeToMakeProduct():number | null;
    getUpgradeMax():number;
    getStructureModels():StructureModel;
    getCreateGoldAmount():number;
}

export interface StructureStateChildI extends StructureStateI {
    upgradeState():void;
}

export interface StructureStateObserverI {
    name:string;
    updateStructure(structure:StructureStateI):void;
}

export interface GUIProductCounterI {
    counterBlock:TextBlock;
    changeText:(string:string) => void;
}

export interface EpicUpgradeStateI {
    name:string;

    attach(observer:EpicUpgradeStateObserverI):void;
    detach(observer:EpicUpgradeStateObserverI):void;
    notify():void;

    getUpgradeNumMax():number;
    getCurrentUpgradeLevel():number;
    
    getCostToUpgrade():number;
    getCurrentValue():number;
    
    getIncrement():number;
    getInstructions():string;
    
}

export interface EpicUpgradeStateChildI extends EpicUpgradeStateI {
    updateState():void;
}

export interface EpicUpgradeStateObserverI {
    name:string;
    updateEpicUpgrade(upgrade:EpicUpgradeStateI):void;
}