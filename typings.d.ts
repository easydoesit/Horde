import { FarmLand } from "./src/models_structures/farmLand";

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
    updateGameState(gamestate:GameStateI):void;
}

export interface MathStateI {
    totalGold:number;
    goldPerSecond:number;
    totalFarmers:number;
    runningFarmers:number;
    farmersMax:number;
    wheatValue:number;
    costOfWheat:number;
    wheatUpgrades:number;
    attach(observer:MathStateObserverI):void;
    detach(observer:MathStateObserverI):void;
    notify():void;
    makeFarmerRun(number:number):void;
    endFarmerRun():void;
    increaseFarmerCount(number:number):void;
    changeGoldPerSecond():number
    wheatValueChange():void
}

export interface MathStateObserverI { //subscribe to whatever you want
    updateMathState(mathstate:MathStateI):void;
}


export interface GoldStateI {
    totalGold:number;
    attach(goldStateObserver:GoldStateObserverI):void;
    detach(farmerStateObserver:GoldStateObserverI):void;
    notify():void;
}

export interface GoldStateObserverI {
    updateGoldAttributes(goldState:GoldStateI):void;
}

export interface GoldPerSecondI {
    goldPerSecond:number;
    attach(observer:GoldPerSecondObserverI):void;
    detach(observer:GoldPerSecondObserverI):void;
    notify():void;
    changeGoldPerSecond():void;
}

export interface GoldPerSecondObserverI {
    onUpdateGoldPerSecond(goldPerSecond:GoldPerSecondI):void;
}

export interface WheatStateI {
    wheatValue:number;
    attach(observer:WheatStateObserverI):void;
    detach(observer:WheatStateObserverI):void;
    notify():void;
    changeWheat():void;
}

export interface WheatStateObserverI {
    updateWheat(wheatState:WheatStateI):void;
}

export interface FarmerStateI {
    totalFarmers:number;
    runningFarmers:number;
    farmersMax:number;
    attach(farmerStateObserver:FarmerStateObserverI):void;
    detach(farmerStateObserver:FarmerStateObserverI):void;
    notify():void;
    increaseFarmerCount(amount:number):number;
    decreaseFarmerCount(amound:number):number;

}

export interface FarmerStateObserverI {
    setFarmers(FarmerState:FarmerStateI):void;
}

export interface FarmStateI {
    name:string;
    farmersMax: number;
    farmUpgradeCost: number;
    farmersNextMax:number | string | void;
    gamePieceName:FarmLand['name'];
    upgradeLevel:number;
    farmUpgradeAllowed:Boolean;
    attach(FarmStateObserver:StructureStateObserverI):void;
    detach(FarmStateObserver:StructureStateObserverI):void;
    notify():void;
    changeState():void;
}

export interface StructureStateObserverI {
    updateUI():void;    
}

