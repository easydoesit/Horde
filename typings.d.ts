
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

interface GameStateObserverI {

    updateGameState(gamestate:GameStateI):void;

}