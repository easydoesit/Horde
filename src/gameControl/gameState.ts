import { GameStateT, GameStateI, GameStateObserverI } from "../../typings";
import { DEBUGMODE } from "../utils/CONSTANTS";

export class GameState implements GameStateI{
    private _name:string;
    private _observers:GameStateObserverI[];
    public state:GameStateT;

    constructor(gameState:GameStateT) {
        this._name ='gameState'
        this.state = gameState;
        this._observers =[];
    }

    public attach(observer:GameStateObserverI):void {
        const observerExists = this._observers.includes(observer);
        
        if(observerExists) {
            if (DEBUGMODE) {
                return console.log(`${this._name} ${observer.name} has been attached already`);
            }
        }

        this._observers.push(observer);
        
        if (DEBUGMODE) {
            console.log(`${this._name} attached ${observer.name}`);
        }

    }

    public detach(observer:GameStateObserverI) {
        const observerIndex = this._observers.indexOf(observer);

        if (observerIndex === -1) {
            if (DEBUGMODE) {
                return console.log(`No ${observer.name} on ${this._name}`);
            }
            return;
        }
        
        this._observers.splice(observerIndex, 1);

        if (DEBUGMODE) {
            console.log(`Detached ${observer.name} from ${this._name}`);
        }
    }

    public notify(): void {
        for(const observer of this._observers) {
            observer.updateGameState(this);
        }
        
    }

    public setGameState(gamesState:GameStateT) {
        this.state = gamesState;
        this.notify();
    }

}