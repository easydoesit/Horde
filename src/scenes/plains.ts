import { Engine, Scene, Vector3, FreeCamera, Color4, DirectionalLight } from "@babylonjs/core";
import { AdvancedDynamicTexture,  Button, Rectangle, Control,} from "@babylonjs/gui";

import { App } from "../app";
import { GUIPlayMode } from "../GUI/gui_playmode";

import { GameStateT } from "../../typings";
import { Hill } from "../models_structures/hill";
import { PlainsBackground } from "../models_backgrounds/plains_background";

export class Plains extends Scene {
    private _app:App;
    private _gameState:GameStateT;
    private _GUI:GUIPlayMode;

    constructor(app:App, engine:Engine) {
        super(engine);
        this._app = app;
        this._gameState = 'PLAINS'
        
        this._initialize(engine);

    }

    private async _initialize(engine:Engine):Promise<void>{
        engine.displayLoadingUI();
        this.clearColor = new Color4(0.15, 0.15, 0.15, 1);

        //temp camera for now TODO - MAKE GAME CAMERA
        let camera = new FreeCamera('cameraPlayScreen', new Vector3(-25,5,0), this);
        camera.setTarget(new Vector3(0,4,0));

        //lights can be different for each scene
        //TODO Make a Light Class and ShadowCLass that includes 
        //all items in scene using scene.meshes
        const mainLight = new DirectionalLight('mainLight', new Vector3(1,-1,1),this);

        //load the hill - required in all scenes
        const hill = new Hill(this);

        //load the background
        const background = new PlainsBackground(this);

        //--GUI--
        const guiPlayMode = new GUIPlayMode(this);

        //--SCENE FINISHED LOADING--
        
        await this.whenReadyAsync();
        this._app.gameState.state = this._gameState;
        engine.hideLoadingUI();

    }

}