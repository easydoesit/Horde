import { Engine, Scene, Vector3, FreeCamera } from "@babylonjs/core";

export class StartScreen extends Scene {

    constructor(engine:Engine) {
        super(engine);
        this._initialize(engine);

    }

    private async _initialize(engine:Engine):Promise<void>{
        engine.displayLoadingUI();

        const camera = new FreeCamera('cameraStartScreen', new Vector3(0,0,0), this);
        camera.setTarget(Vector3.Zero());

        //--SCENE FINISHED LOADING--
        
        await this.whenReadyAsync().then(() => {
            engine.hideLoadingUI();
        });

    }

}