import { StructureModel } from "./src/models_structures/structureModels";
import { Rectangle, ScrollViewer, StackPanel, TextBlock } from "@babylonjs/gui";
import { PlayMode } from "./src/scenes/playmode";
import { InSceneStuctureGUI } from "./src/GUI/inSceneStructureGUI";
import { UpgradeWindow } from "./src/GUI/upgradeWindow";
import { AddStructureButton } from "./src/GUI/structureUpgrades/addStructureButton";
import { StructureUpgradeSection } from "./src/GUI/structureUpgrades/structureUpgradeSection";
import { Vector3 } from "@babylonjs/core";


export type GameStateT = 'START_SCREEN' |'PLAY_MODE' | 'END_SCREEN';

export type ResourcesT = 'Ore' | 'Weapons' | 'Villages' | 'Loot' | 'Goldbars' | 'Portals' | 'Relics';
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
    changeGoldMultiplyer(changeValue:number):void;
    getGoldMultiplyer():number;
    getGoldPerSecond():number;
    addGold(amount:number):void;
    spendGold(amount:number):void;
    getTotalGold():number;

    getWheatValue():number;
    changeWheatValue(value:number):void;

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
    getUpgradeCostResources():number;
    getUpgradeLevel():number;
    getNextUpgradeLevel():number;
    getUpgradeMax():number;
    getUpgradeSectionInstructions():string;
    changeUpgradeSectionInstructions(newText:string):void;
    
    getResourceName():ResourcesT | null;
    addResource(amount:number):void;
    removeResource(amount:number):void;
    
    getTotalResourceAmount():number;
    
    getResourcePerCycle():number;
    changeResourcePerCycle(newValue:number):void;
    getResourceCycleTime():number;
    changeResourceCycleTime(newTime:number):void;
    getResourceMultiplyer():number;
    changeResourceMultiplyer(newValue:number):void;
    getResourceUpgradeValue():number;
    changeResourceUpgradeValue(newValue:number):void;

    getGoldPerCycle():number;
    changeGoldPerCycle(amount:number):void;

    getGoldMultiplyer():number;
    changeGoldMultiplyer(newValue:number):void;
    
    getStructureModels():StructureModel;
    
    getInSceneGui():InSceneStuctureGUI;
    getUpgradesWindow():UpgradeWindow;
    getUpgradeSection():StructureUpgradeSection;
    getAddStructureButton():AddStructureButton;

    getAnimationPaths():Vector3[][];

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
    updateStructureOnCycle(resource:ResourcesT, resourceAmount:number, goldPerCycle:number ):void;
}

export interface GUIResourceCounterI {
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

export interface StandardUpgradeStateI {
    name:string;

    attach(observer:StandardUpgradeStateObserverI):void;
    detach(observer:StandardUpgradeStateObserverI):void;
    notify():void;

    getObservers():StandardUpgradeStateObserverI[];

    getMaxNumUpgrades():number;
    changeMaxNumberUpgrades(value:number):void;
    
    getCurrentUpgradeLevel():number;
    
    getCostToUpgradeGold():number;
    changeCostToUpgradeGold(amount:number):void;

    getCostToUpgradeFarmers():number;
    changeCostToUpgradeFarmers(amount:number):void;

    getCostToUpgradeResources():number;
    changeCostToUpgradeResources(amount:number):void;
    getResourceSource():StructureStateChildI;

    getIncrement():number;
    getEffectValue():number;

    getInstructions():string;
    changeInstructions(text:string):void;

    getStructure():StructureStateChildI;
    
}

export interface StandardUpgradeStateChildI extends StandardUpgradeStateI {
    updateState():void;
}

export interface StandardUpgradeStateObserverI {
    name:string;
    updateStandardUpgrade(upgradeState:StandardUpgradeStateI):void;
}

export interface UpgradeWindowI {
    name:string;

    hideWindow():void;
    showWindow():void;

    getScrollViewer():ScrollViewer;
    getPanelContainer():StackPanel;
}

export interface GUIPlayI {
    getUpgradeWindow(window:string):UpgradeWindow;
}

export interface StructureConstantsI {
    name:StructureNamesT;
    models:string[];
    clickbox:string;
    gamePos:Vector3; 
    upgradeMax:number;
    nextUpgradeCostInGold:(upgradeLevel:number) => number;
    nextUpgradeCostInFarmers:(upgradeLevel:number) => number;
    nextUpgradeCostInResources:(upgradeLevel:number) => number;
    goldPerCycle:number;
    goldMultiplyer:(upgradeLevel:number, upgradeLimit:number) => number;
    character:StructureCharactersT;
    resource: {
        name:ResourcesT;
        resourceUpgradeValue:(upgradeLevel:number, upgradeLimit:number) => number;
        resourcePerCycle:number;
        initialCycleTime:number;
        resourceDependant:ResourcesT | null;
        costOfResourceDependant:number | null;
        cycleTime:(upgradeLevel:number, initCycleTime:number, resourceUpgradeValue:number) => number | number;
        multiplyer:(upgradeLevel:number, upgradeLimit:number) => number;
    } | null;
    otherProps: {
        [key: string]:any;
    } | null
}
