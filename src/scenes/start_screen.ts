import { Engine, Scene, Vector3, FreeCamera } from "@babylonjs/core";

import { App } from "../app";
import { GUIStartScreen } from "../GUI/GUIStartScreen";
import { GameStateT } from "../../typings";

export class StartScreen extends Scene {
    private _app:App;

    public gameState:GameStateT;
    public gui:GUIStartScreen;

    constructor(app:App, engine:Engine) {
        super(engine);
        this._app = app;
        this.gameState = 'START_SCREEN';

        this._initialize(engine);

    }

    private async _initialize(engine:Engine):Promise<void>{
        engine.displayLoadingUI();

        const camera = new FreeCamera('cameraStartScreen', new Vector3(0,0,0), this);
        camera.setTarget(Vector3.Zero());

        //Load the GUI
        this.gui = new GUIStartScreen(this._app, this);

        //--SCENE FINISHED LOADING--
        
        await this.whenReadyAsync();
        //change the gameState
        this._app.gameState.state = this.gameState;

        engine.hideLoadingUI();

    }

}