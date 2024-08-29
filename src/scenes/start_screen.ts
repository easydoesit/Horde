import { Engine, Scene, Vector3, FreeCamera } from "@babylonjs/core";
import { AdvancedDynamicTexture,  Button, Rectangle, Control,} from "@babylonjs/gui";

import { App } from "../app";
import { GameStateT } from "../../typings";

export class StartScreen extends Scene {
    private _app:App;
    private _gameState:GameStateT;

    constructor(app:App, engine:Engine) {
        super(engine);
        this._app = app;
        this._gameState = 'START_SCREEN'

        this._initialize(engine);

    }

    private async _initialize(engine:Engine):Promise<void>{
        engine.displayLoadingUI();

        let camera = new FreeCamera('cameraStartScreen', new Vector3(0,0,0), this);
        camera.setTarget(Vector3.Zero());

        //--GUI--
        const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("PLAYMODEUI");
        //guiMenu.idealHeight = 720;

        const rectWrapper = new Rectangle('wrappper');
        rectWrapper.width = 0.8;
        rectWrapper.thickness = 1;
        guiMenu.addControl(rectWrapper);

        const startBtn = Button.CreateSimpleButton("start", "Start");
        startBtn.fontFamily = "Arial";
        startBtn.width = 0.2
        startBtn.height = "40px";
        startBtn.color = "white";
        startBtn.top = "-360px";
        startBtn.thickness = 2;
        startBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        
        rectWrapper.addControl(startBtn);

        startBtn.onPointerDownObservable.add(() => {
            this.detachControl();
            
            this._app.switchScene(this._app.playMode);

        });

        //--SCENE FINISHED LOADING--
        
        await this.whenReadyAsync();
        this._app.gameState.state = this._gameState;
        engine.hideLoadingUI();

    }

}