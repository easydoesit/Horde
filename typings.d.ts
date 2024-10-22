import { StructureModel } from "./src/models_structures/structureModels";
import { Rectangle, ScrollViewer, StackPanel, TextBlock } from "@babylonjs/gui";
import { PlayMode } from "./src/scenes/playmode";
import { InSceneStuctureGUI } from "./src/GUI/inSceneStructureGUI";
import { UpgradeWindow } from "./src/GUI/upgradeWindow";


export type GameStateT = 'START_SCREEN' |'PLAY_MODE' | 'END_SCREEN';

export type ProductsT = 'Ore' | 'Weapons' | 'Villages' | 'Loot' | 'Goldbars' | 'Portals' | 'Relics';
export type StructureNamesT = 'Farm01' | 'Farm02' | 'Farm03' | 'Farm04' | 'Mine' | 'Forge' | 'Barracks' | 'Thieves Guild' | 'Workshop' | 'Tower' | 'Tavern';
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
}

export interface MathStateObserverI { 
    name:string;
    updateMathState(mathstate:MathStateI):void;//subscribe to whatever you want
}

export interface StructureStateI {

    attachObserversUpgrade(observer:StructureStateObserverOnUpgradeI):void;
    detachObserversUpgrade(observer:StructureStateObserverOnUpgradeI):void;
    notifyObserversOnUpgrade():void;
    
    attachObserversCycle(observer:StructureStateObserverOnCycleI):void;
    detachObserversCycle(observer:StructureStateObserverOnCycleI):void;
    notifyObserversOnCycle():void;
    
    getName():StructureNamesT;
    getScene():PlayMode;
    getUpgradeCostFarmers():number;
    getUpgradeCostGold():number;
    getUpgradeLevel():number;
    
    getProductName():ProductsT | null;
    addProduct(amount:number):void;
    removeProduct(amount:number):void;
    getTotalProductAmount():number;
    getProductPerCycle():number;
    changeProductPerCycle(newValue:number):void;
    getProductCycleTime():number;
    changeProductCycleTime(newTime:number):void;
    getUpgradeMax():number;
    getStructureModels():StructureModel;
    getGoldPerCycle():number;
    changeGoldPerCycle(amount:number):void;

    getInSceneGui():InSceneStuctureGUI;
    getUpgradesWindow():UpgradeWindow;
}

export interface StructureStateChildI extends StructureStateI {
    upgradeState():void;
}

export interface StructureStateObserverOnUpgradeI {
    name:string;
    updateStructureOnUpgrade(structure:StructureStateI):void;
    
}

export interface StructureStateObserverOnCycleI {
    name:string;
    updateStructureOnCycle(product:ProductsT, productAmount:number, goldPerCycle:number ):void;
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

export interface UpgradeWindowI {
    name:string;

    hideWindow():void;
    showWindow():void;
    getScrollViewer():ScrollViewer;
    getPanelContainer():StackPanel;
}