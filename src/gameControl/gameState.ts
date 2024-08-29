import { GameStateT } from "../../typings";

export class GameState {

    public state:GameStateT;

    constructor(gameState:GameStateT) {
        this.state = gameState;
    }

}