import { Engine, Scene, Vector3, FreeCamera, Color4 } from "@babylonjs/core";
import { AdvancedDynamicTexture,  Button, Rectangle, Control,} from "@babylonjs/gui";

import { App } from "../app";
import { GameStateT } from "../../typings";

export class Playmode extends Scene {
    private _app:App;
    private _gameState:GameStateT

    constructor(app:App, engine:Engine) {
        super(engine);
        this._app = app;
        this._gameState = 'PLAY_MODE'
        
        this._initialize(engine);

    }

    private async _initialize(engine:Engine):Promise<void>{
        engine.displayLoadingUI();
        this.clearColor = new Color4(0.15, 0.15, 0.15, 1);

        let camera = new FreeCamera('cameraPlayScreen', new Vector3(0,0,0), this);
        camera.setTarget(Vector3.Zero());

        //--GUI--
        const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("StartUI");
        //guiMenu.idealHeight = 720;

        const rectWrapper = new Rectangle('wrappper');
        rectWrapper.width = 0.8;
        rectWrapper.thickness = 1;
        guiMenu.addControl(rectWrapper);

        const addBtn = Button.CreateSimpleButton("add", "Add");
        addBtn.fontFamily = "Arial";
        addBtn.width = 0.2
        addBtn.height = "40px";
        addBtn.color = "white";
        //addBtn.top = "-360px";
        addBtn.thickness = 2;
        addBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        
        rectWrapper.addControl(addBtn);

        addBtn.onPointerDownObservable.add(() => {
            //this._app.switchScene(this._app.playMode);

            //this.detachControl();
       
        });

        //--SCENE FINISHED LOADING--
        
        await this.whenReadyAsync();
        this._app.gameState.state = this._gameState;
        engine.hideLoadingUI();

    }

}