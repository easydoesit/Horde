import { Engine, Scene, Vector3, FreeCamera, Color4, DirectionalLight, Matrix, TransformNode } from "@babylonjs/core";
import { castlClickBox, castleModels, farmClickBox, FarmHouse01Pos, FarmHouse02Pos, FarmHouse03Pos, FarmHouse04Pos, farmModels, hillModels, mineClickBox, mineModels, MinePos } from "../utils/CONSTANTS";

//classes
import { GUIPlay } from "../GUI/GUIPlay";
import { App } from "../app";

//gamepieces
import { Structure } from "../models_structures/structures";
import { PlainsBackground } from "../models_backgrounds/plains_background";
import { Dragon } from "../models_characters/dragon";
import { Egg } from "../models_props/egg";
import { MathStateI } from "../../typings";
import { MathState } from "../gameControl/mathState";
import { Ogre } from "../models_characters/ogre";

export class PlayMode extends Scene {
    public mainCamera:FreeCamera;
    private _app:App;
    public mathState:MathStateI;

    //gamepieces 
    private _hill:Structure;

    //interacative
    public castle:Structure;

    public farm01:Structure;
    public farm02:Structure;
    public farm03:Structure;
    public farm04:Structure;
    
    public mine:Structure;

    //for cloning
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
        this.castle = new Structure('Castle', this, castleModels, castlClickBox);
        this.castle.position = new Vector3(-.6, 6.5, -.2);

        //load the entry level farms
        this.farm01 = new Structure('Farm01', this, farmModels, farmClickBox);
        this.farm01.position = new Vector3(0,.5,-4);
        
        //these start out of view
        this.farm02 = new Structure('Farm02', this, farmModels, farmClickBox);
        this.farm02.position = new Vector3(0,-10,4);

        this.farm03 = new Structure('Farm03', this, farmModels, farmClickBox);
        this.farm03.position = new Vector3(0,-10,-12);

        this.farm04 = new Structure('Farm04', this, farmModels, farmClickBox);
        this.farm04.position = new Vector3(0,-10,12);

        this.mine = new Structure('Mine', this, mineModels, mineClickBox );    
        this.mine.position = new Vector3(MinePos.x, MinePos.y - 10 , MinePos.z);


        //Characters TODO- Add them all so they should be cloned.
        this.dragon = new Dragon('Dragon', this, this._app.gui as GUIPlay);
        this.dragon.position = new Vector3(0,-10,0);
        this.egg = new Egg('egg', this, this._app.gui as GUIPlay, this.dragon);
        
        this.ogre = new Ogre('ogre', this, this._app.gui as GUIPlay);

        //load the hill
        this._hill = new Structure('Hill', this, hillModels, null );
    
        //load the background
        const background = new PlainsBackground(this);

        //interact with the scene
        this.onPointerDown = function castRay() {
            const ray = this.createPickingRay(this.pointerX, this.pointerY, Matrix.Identity(), this.mainCamera);

            const hit = this.pickWithRay(ray);

            if (hit.pickedMesh === this.farm01.clickZone || hit.pickedMesh === this.farm02.clickZone ) {
                console.log('Farm Clicked');
                this._app.gui.showUpgrades(this._app.gui.GUIWrapperFarmUpgrade);
            }

            if (hit.pickedMesh === this.castle.clickZone) {
                console.log('Castle Clicked');
                this._app.gui.showUpgrades(this._app.gui.GUIWrapperCastleUpgrade);
            }

            if (hit.pickedMesh === this.mine.clickZone) {
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
  
        //show any hidden models waiting on Async
        this._hill.showModel(0);
        this.castle.showModel(0);
        this.farm01.showModel(0);
        this.farm02.showModel(0);
        this.farm03.showModel(0);
        this.farm04.showModel(0);

        //change the GUI
        engine.hideLoadingUI();
       
    }

}