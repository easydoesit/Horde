import { Engine, Scene, Vector3, FreeCamera, Color4, DirectionalLight, Matrix, TransformNode } from "@babylonjs/core";

//classes
import { App } from "../app";
import { GUIPlay } from "../GUI/GUIPlay";
import { GameStateT } from "../../typings";

//gamepieces
import { Hill } from "../models_structures/hill";
import { PlainsBackground } from "../models_backgrounds/plains_background";
import { FarmLand01 } from "../models_structures/farmland01";

export class PlayMode extends Scene {
    private _app:App;
    private _gameState:GameStateT;
    
    public gui:GUIPlay;
    public mainCamera:FreeCamera;

    constructor(app:App, engine:Engine) {
        super(engine);
        this._app = app;
        this._gameState = 'PLAY_MODE';
        
        this._initialize(engine);

    }

    private async _initialize(engine:Engine):Promise<void>{
        engine.displayLoadingUI();
        this.clearColor = new Color4(0.15, 0.15, 0.15, 1);

        //temp camera for now TODO - MAKE GAME CAMERA
        this.mainCamera = new FreeCamera('cameraPlayScreen', new Vector3(-25,5,0), this);
        this.mainCamera.setTarget(new Vector3(0,4,0));

        //the gui is currently where all the math is done.
        this.gui = new GUIPlay(this);

        //lights can be different for each scene
        //TODO Make all the background art swappable. It's a small app.
        //all items in scene using scene.meshes
        const mainLight = new DirectionalLight('mainLight', new Vector3(1,-1,1),this);
        mainLight.intensity = 2;
        
        //load the hill - required in all scenes
        const hill = new Hill(this);
        //load the starting Farm
        const farmland01 = new FarmLand01(this);
  
        //the gui needs to know the number of farms for math.
        
        //interact with the farmland
        this.onPointerDown = function castRay() {
            const ray = this.createPickingRay(this.pointerX, this.pointerY, Matrix.Identity(), this.mainCamera);

            const hit = this.pickWithRay(ray);

            if (hit.pickedMesh === farmland01.model.allMeshes[0]) {
                console.log('FarmClicked');
                this.gui.showUpgrades(this.gui.playGUIWrapperFarmUpgrade);
            }
        }


        //load the background
        const background = new PlainsBackground(this);

        //--SCENE FINISHED LOADING--
        
        await this.whenReadyAsync();
          //change the gameState
          this._app.gameState.state = this._gameState;
          //change the GUI
          engine.hideLoadingUI();

    }

}