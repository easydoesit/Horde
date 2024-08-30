import { Engine, Scene, Vector3, FreeCamera, Color4 } from "@babylonjs/core";
import { AdvancedDynamicTexture,  Button, Rectangle, Control,} from "@babylonjs/gui";

import { App } from "../app";
import { GUIPlayMode } from "../GUI/gui_playmode";

import { GameStateT } from "../../typings";

export class Playmode extends Scene {
    private _app:App;
    private _gameState:GameStateT;
    private _GUI:GUIPlayMode;

    constructor(app:App, engine:Engine) {
        super(engine);
        this._app = app;
        this._gameState = 'PLAY_MODE'
        
        this._initialize(engine);

    }

    private async _initialize(engine:Engine):Promise<void>{
        engine.displayLoadingUI();
        this.clearColor = new Color4(0.15, 0.15, 0.15, 1);

        //temp camera for now
        let camera = new FreeCamera('cameraPlayScreen', new Vector3(0,0,0), this);
        camera.setTarget(Vector3.Zero());

        //--GUI--
        const guiPlayMode = new GUIPlayMode(this);

        //--SCENE FINISHED LOADING--
        
        await this.whenReadyAsync();
        this._app.gameState.state = this._gameState;
        engine.hideLoadingUI();

    }

}