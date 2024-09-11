import { Engine, Scene, Vector3, FreeCamera, Color4, DirectionalLight, Matrix, TransformNode } from "@babylonjs/core";

//classes
import { App } from "../app";
import { GUIPlay } from "../GUI/GUIPlay";
import { GameStateT } from "../../typings";

//gamepieces
import { Hill } from "../models_structures/hill";
import { PlainsBackground } from "../models_backgrounds/plains_background";
import { FarmLand } from "../models_structures/farmLand";
import { FarmHouse } from "../models_structures/farmHouse";

export class PlayMode extends Scene {
    private _app:App;
    private _gameState:GameStateT;
    
    public gui:GUIPlay;
    public mainCamera:FreeCamera;

    //gamepieces 
    private _hill:Hill;
    //interacative
    public farmLand:FarmLand;
    //for cloning
    public farmHouse:FarmHouse;

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
        this._hill = new Hill(this);
        //load the starting Farm
        this.farmLand = new FarmLand('FarmLand01', this, new Vector3(-5,0.67,-1.5));
        console.log(this.farmLand);
        
        //load all models but position them off screen for faster loading times.
        this.farmHouse = new FarmHouse('FarmHouseBase',this);
        this.farmHouse.position = new Vector3(0,-10,0);


        //the gui needs to know the number of farms for math.
        
        //interact with the farmLand
        this.onPointerDown = function castRay() {
            const ray = this.createPickingRay(this.pointerX, this.pointerY, Matrix.Identity(), this.mainCamera);

            const hit = this.pickWithRay(ray);

            if (hit.pickedMesh === this.farmLand.model.allMeshes[0]) {
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