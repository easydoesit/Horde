import { Engine, Scene, Vector3, FreeCamera, Color4, DirectionalLight, Matrix, TransformNode } from "@babylonjs/core";
import { FarmHouse01Pos, FarmHouse02Pos, FarmHouse03Pos, FarmHouse04Pos, MinePos } from "../utils/CONSTANTS";

//classes
import { GUIPlay } from "../GUI/GUIPlay";
import { App } from "../app";

//gamepieces
import { Hill } from "../models_structures/hill";
import { PlainsBackground } from "../models_backgrounds/plains_background";
import { FarmLand } from "../models_structures/farmLand";
import { FarmHouse } from "../models_structures/farmHouse";
import { Castle01 } from "../models_structures/castle";
import { Mine } from "../models_structures/mine";
import { Dragon } from "../models_characters/dragon";
import { Egg } from "../models_props/egg";
import { MathStateI } from "../../typings";
import { MathState } from "../gameControl/mathState";
import { Ogre } from "../models_characters/ogre";
//import { Mine02 } from "../models_structures/mine02";

export class PlayMode extends Scene {
    public mainCamera:FreeCamera;
    private _app:App;
    public mathState:MathStateI;

    //gamepieces 
    private _hill:Hill;

    //interacative
    public castle01:Castle01;

    public farmLand01:FarmLand;
    public farmLand02:FarmLand;
    public farmLand03:FarmLand;
    public farmLand04:FarmLand;
    
    public mine:Mine;

    //for cloning
    public farmHouse:FarmHouse;
    public dragon:Dragon;
    public egg:Egg;
    public ogre:Ogre;

    constructor(app:App,) {
        super(app.engine);
        this._app = app

        this._initialize(this._app.engine);


    }

    private async _initialize(engine:Engine):Promise<void>{
        engine.displayLoadingUI();
        this.clearColor = new Color4(0.15, 0.15, 0.15, 1);
        this.mathState = new MathState(this);

        //temp camera for now TODO - MAKE GAME CAMERA
        this.mainCamera = new FreeCamera('cameraPlayScreen', new Vector3(-25,5,0), this);
        this.mainCamera.setTarget(new Vector3(0,4,0));

        //lights can be different for each scene
        //TODO Make all the background art swappable. It's a small app.
        //all items in scene using scene.meshes
        const mainLight = new DirectionalLight('mainLight', new Vector3(1,-1,1),this);
        mainLight.intensity = 2;

        //load the starter Castle and position on hill
        this.castle01 = new Castle01(this);
        this.castle01.position = new Vector3(-.6, 6.5, -.2);

        //load the entry level farms
        this.farmLand01 = new FarmLand('FarmLand01', this, FarmHouse01Pos);
        this.farmLand01.position = new Vector3(0,.5,-4);
        
        //these start out of view
        this.farmLand02 = new FarmLand('FarmLand02', this, FarmHouse02Pos);
        this.farmLand02.position = new Vector3(0,-10,4);

        this.farmLand03 = new FarmLand('FarmLand03', this, FarmHouse03Pos);
        this.farmLand03.position = new Vector3(0,-10,-12);

        this.farmLand04 = new FarmLand('FarmLand04', this, FarmHouse04Pos);
        this.farmLand04.position = new Vector3(0,-10,12);

        this.mine = new Mine('Mine', this);    
        this.mine.position = new Vector3(MinePos.x, MinePos.y - 10 , MinePos.z);

        //load all models but position them off screen for faster loading times.
        this.farmHouse = new FarmHouse('FarmHouseBase',this);
        this.farmHouse.position = new Vector3(0,-10,0);

        //Characters TODO- Add them all so they should be cloned.
        this.dragon = new Dragon('Dragon', this, this._app.gui as GUIPlay);
        this.dragon.position = new Vector3(0,-10,0);
        this.egg = new Egg('egg', this, this._app.gui as GUIPlay, this.dragon);
        
        this.ogre = new Ogre('ogre', this, this._app.gui as GUIPlay);

        //load the hill
        this._hill = new Hill(this);
        
        //load the background
        const background = new PlainsBackground(this);

        //interact with the scene
        this.onPointerDown = function castRay() {
            const ray = this.createPickingRay(this.pointerX, this.pointerY, Matrix.Identity(), this.mainCamera);

            const hit = this.pickWithRay(ray);

            if (hit.pickedMesh === this.farmLand01.model.allMeshes[0] || hit.pickedMesh === this.farmLand02.model.allMeshes[0] ) {
                console.log('Farm Clicked');
                this._app.gui.showUpgrades(this._app.gui.GUIWrapperFarmUpgrade);
            }

            if (hit.pickedMesh === this.castle01.model.allMeshes[0]) {
                console.log('Castle Clicked');
                this._app.gui.showUpgrades(this._app.gui.GUIWrapperCastleUpgrade);
            }

            if (hit.pickedMesh === this.mine.clickBox.meshes.allMeshes[0]) {
                console.log('Mine Clicked');
                this._app.gui.showUpgrades(this._app.gui.wrapperMineUpgrade);
            }

            if (hit.pickedMesh === this.dragon.clickBox.meshes.allMeshes[0]) {
                console.log('Dragon Clicked');
                if (this.dragon.clickable) {
                    this.egg.runAnimation();
                    this.dragon.makeUnclickable();
                    
                }
            }

            if (hit.pickedMesh === this.ogre.clickBox.meshes.allMeshes[0]) {
                
                if (this.ogre.clickable) {
                    this.ogre.takeClick();
                    if(this.ogre.clicksLeft === 0) {
                        this.ogre.playOgreExit();
                    }
                }
            }

        }

        //--SCENE FINISHED LOADING--
        
        await this.whenReadyAsync();
  
          //change the GUI
          engine.hideLoadingUI();
    }

}