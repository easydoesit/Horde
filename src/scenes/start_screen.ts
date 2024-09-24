import { Engine, Scene, Vector3, FreeCamera } from "@babylonjs/core";

import { App } from "../app";

export class StartScreen extends Scene {
    private _app:App;

    constructor(engine:Engine) {
        super(engine);
        this._initialize(engine);

    }

    private async _initialize(engine:Engine):Promise<void>{
        engine.displayLoadingUI();

        const camera = new FreeCamera('cameraStartScreen', new Vector3(0,0,0), this);
        camera.setTarget(Vector3.Zero());

        //--SCENE FINISHED LOADING--
        
        await this.whenReadyAsync();
       
        engine.hideLoadingUI();

    }

}