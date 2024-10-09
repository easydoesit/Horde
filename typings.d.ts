import { StructureModel } from "./src/models_structures/structureModels";
import { Rectangle, TextBlock } from "@babylonjs/gui";


export type GameStateT = 'START_SCREEN' |'PLAY_MODE' | 'END_SCREEN';

export type ProductsT = 'Ore' | 'Weapons' | 'Villages' | 'Loot';

export type StructureCharactersT = 'farmer' | 'miner' | 'blacksmith' | 'soldier' | 'thief';

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
    costOfWheatUpgrade:number;
    wheatUpgrades:number;
    
    totalOre:number;
    costOfOreGold:number;
    //timeToMakeOre:number;

    totalWeapons:number;
    costOfWeaponsGold:number;
    //timeToMakeWeapons:number;

    totalVillages:number;
    costOfVillagesGold:number;
    //timeToMakeVillages:number;

    totalLoot:number;
    costOfLootGold:number;
    //timeToMakeVillages:number;

    attach(observer:MathStateObserverI):void;
    detach(observer:MathStateObserverI):void;
    notify():void;
   
    makeFarmerRun(number:number):void;
    endFarmerRun():void;
    addFarmers(number:number):void;
    spendFarmers(amount:number):void;
    changeFarmersMax():void;
    
    changeGoldPerSecond():number;
    addGold(amount:number):void;
    spendGold(amount:number):void;

    addLumens(amount:number):void;
    spendLumens(amount:number):void;
    
    upgradeWheat():void;
    changeCostOfWheatUpgrade():void;
    changeWheatValue():void;
   
    addProduct(product:ProductsT, amount:number):void;
    removeProduct(product:ProductsT, amount:number):void;

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
    product:string | null;
    timeToMakeProduct:number | null;
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

export type StructureMathFunctionsT = {
    upgradeCostOfGold:(upgradeLevel:number) => number;
    upgradeCostFarmers:((upgradeLevel:number) => number) | null;
    timeToMakeProduct:((upgradeLevel:number) => number) | null;
}

export interface GUIProductCounterI {
    counterBlock:TextBlock;
    changeText:(string:string) => void;
}