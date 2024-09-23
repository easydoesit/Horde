import { GameStateT, GameStateI, GameStateObserverI } from "../../typings";
import { DEBUGMODE } from "../utils/CONSTANTS";

export class GameState implements GameStateI{
    
    private _gameStateObservers:GameStateObserverI[];
    public state:GameStateT;

    constructor(gameState:GameStateT) {
        this.state = gameState;
        this._gameStateObservers =[];
    }

    public attach(gameStateObserver:GameStateObserverI):void {
        const observerExists = this._gameStateObservers.includes(gameStateObserver);
        
        if(observerExists) {
            return console.log(`GameStateObserverI has been attached already`);

        }
        
        this._gameStateObservers.push(gameStateObserver);

    }

    public detach(gameStateObserver:GameStateObserverI) {
        const observerIndex = this._gameStateObservers.indexOf(gameStateObserver);

        if (!observerIndex) {
            return console.log('Detached a GameStateObserverI');
        }

    }

    public notify(): void {
        for(const gameStateObserver of this._gameStateObservers) {
            gameStateObserver.updateGameState(this);
        }
        
    }

    public setGameState(gamesState:GameStateT) {
        this.state = gamesState;
        this.notify();
    }

}