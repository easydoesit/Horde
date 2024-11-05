import { StructureModel } from "./src/models_structures/structureModels";
import { ScrollViewer, StackPanel, TextBlock } from "@babylonjs/gui";
import { PlayMode } from "./src/scenes/playmode";
import { InSceneStuctureGUI } from "./src/GUI/inSceneStructureGUI";
import { UpgradeWindow } from "./src/GUI/upgradeWindow";
import { AddStructureButton } from "./src/GUI/structureUpgrades/addStructureButton";
import { StructureUpgradeSection } from "./src/GUI/structureUpgrades/structureUpgradeSection";
import { AbstractMesh, Vector3 } from "@babylonjs/core";


export type GameStateT = 'START_SCREEN' |'PLAY_MODE' | 'END_SCREEN';

export type ResourcesT = 'Ore' | 'Weapons' | 'Villages' | 'Loot' | 'Goldbars' | 'Portals' | 'Relics';
export type StructureNamesT = 'Farms' | 'Farm01' | 'Farm02' | 'Farm03' | 'Farm04' | 'Mine' | 'Forge' | 'Barracks' | 'Thieves Guild' | 'Workshop' | 'Tower' | 'Tavern';
export type StructureCharactersT = 'farmer' | 'miner' | 'blacksmith' | 'soldier' | 'thief' | 'alchemist' | 'wizard' | 'adventurer';
export type KingomNamesT = 'Plains' | 'Forest' | 'Tundra' | 'Swamp' | 'Mountains' | 'Coast' | 'Oasis' | 'Tropical' | 'Waterfall' | 'Sky' | 'Moon' | 'Inter-Dimensional';


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
    setFarmersMax():void;

    setGoldPerSecond():number;
    setGoldMultiplyer(setValue:number):void;
    getGoldMultiplyer():number;
    getGoldPerSecond():number;
    addGold(amount:number):void;
    spendGold(amount:number):void;
    getTotalGold():number;

    getWheatValue():number;
    setWheatValue(value:number):void;

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

    getAlive():boolean;
    makeAlive():void;
    
    getName():StructureNamesT;
    getScene():PlayMode;

    getUpgradeLevel():number;
    getNextUpgradeLevel():number;
    getUpgradeMax():number;
    getUpgradeSectionInstructions():string;
    setUpgradeSectionInstructions(newText:string):void;
    
    getUpgradeCostResources():number;
    getResourceName():ResourcesT | null;
    addResource(amount:number):void;
    removeResource(amount:number):void;
    getTotalResourceAmount():number;  
    getResourcePerCycle():number;
    setResourcePerCycle(newValue:number):void;
    getResourceCycleTime():number;
    setResourceCycleTime(newTime:number):void;
    getResourceMultiplyer():number;
    setResourceMultiplyer(newValue:number):void;
    getResourceUpgradeValue():number;
    setResourceUpgradeValue(newValue:number):void;
    getInitResourceCost():number;
    getInitResourceName():ResourcesT;

    getUpgradeCostGold():number;
    setUpgradeCostGold(newCost:number):void;
    getGoldPerCycle():number;
    setGoldPerCycle(amount:number):void;
    getGoldMultiplyer():number;
    setGoldMultiplyer(newValue:number):void;
    getInitGoldCost():number;

    getUpgradeCostFarmers():number;
    getInitFarmerCost():number;

    getStructureModels():StructureModel;
    moveStructuresToGamePosition():void
    
    getInSceneGui():InSceneStuctureGUI;
    getUpgradesWindow():UpgradeWindow;
    getUpgradeSection():StructureUpgradeSection;
    getAddStructureButton():AddStructureButton;

    getSteward():boolean;
    setSteward(state:boolean):void;
    getStewardCost():number;

    getAnimationPaths():Vector3[][];
    animateCharacters():void;
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
    setText:(string:string) => void;
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
    setMaxNumberUpgrades(value:number):void;
    
    getCurrentUpgradeLevel():number;
    
    getCostToUpgradeGold():number;
    setCostToUpgradeGold(amount:number):void;

    getCostToUpgradeFarmers():number;
    setCostToUpgradeFarmers(amount:number):void;

    getCostToUpgradeResources():number;
    setCostToUpgradeResources(amount:number):void;
    getResourceSource():StructureStateChildI;

    getIncrement():number;
    getEffectValue():number;

    getInstructions():string;
    setInstructions(text:string):void;

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
    initCosts:{
        gold:number,
        farmers:number,
        resources:number,
        resourceName:ResourcesT | null;
    };
    nextUpgradeCostInGold:(upgradeLevel:number) => number;
    nextUpgradeCostInFarmers:(upgradeLevel:number) => number;
    nextUpgradeCostInResources:(upgradeLevel:number) => number;
    goldPerCycle:number;
    goldMultiplyer:(upgradeLevel:number, upgradeLimit:number) => number;
    character:StructureCharactersT;
    stewardCost:number | null;
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

export type KingdomsT = {
    name:KingomNamesT
    level:number;
    costToUnlockGold:number;
    costToUnlockFarmers:number;
    costToUnlockResources:{
        name:ResourcesT
        amount:number
    } | null;
    baseGoldBoost:number;
    baseResourceBoost:number;
    prestigeLumens:number;
    importedModels:string[] | null;
}

export interface KingdomI {
    getName():string;
    getLevel():KingdomsT['level'];

    getModels():any[] | null;
    
    getCostToUnlockGold():KingdomsT['costToUnlockGold'];
    setCostToUnlockGold(newCost:number):void;
    
    getCostToUnlockFarmers():KingdomsT['costToUnlockFarmers'];
    setCostToUnlockFarmers(newCost:number):void;
    
    getCostToUnlockResources():KingdomsT['costToUnlockResources'];
    setCostToUnlockResources(newResources:KingdomsT['costToUnlockResources']):void;
    
    getBaseGoldBoost():KingdomsT['baseGoldBoost'];
    setBaseGoldBoost(newValue:number):void;

    getBaseResourceBoost():KingdomsT['baseResourceBoost'];
    setBaseResourceBoost(newValue:number):void;

    getPrestigeLumens():KingdomsT['prestigeLumens'];
    setPrestigeLumens(newValue:number):void;

    setEnabled(bool:boolean):void;

}

export interface KingdomStateI {
    getName():string;

    attach(observer:KingdomStateObserverI):void;
    detach(observer:KingdomStateObserverI):void;
    notify():void;
    
    getCurrentKingdom():KingdomI;
    setCurrentingdom(kingdom:KingdomI):void;

    getNextKingdom():KingdomI;
    setNextKingdom():void;

    getAllKingdoms():KingdomI[];

    upgrade():void;

    getScene():PlayMode;

}

export interface KingdomStateObserverI {
    getName():string;
    onKingomStateUpgrade(kingdom:KingdomI):void;
}