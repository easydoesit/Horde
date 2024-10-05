import { Engine, Scene, Vector3, FreeCamera, Color4, DirectionalLight, Matrix} from "@babylonjs/core";
import { castlClickBox, castleModels, castlePos, Farm01Pos, Farm02Pos, Farm03Pos, Farm04Pos, farmClickBox, farmModels, hillModels, mineClickBox, mineModels, minePos, smithyClickBox, smithyModels, smithyPos } from "../utils/CONSTANTS";
import { GUIPlay } from "../GUI/GUIPlay";
import { App } from "../app";
import { StructureModel } from "../models_structures/structureModels";
import { PlainsBackground } from "../models_backgrounds/plains_background";
import { Dragon } from "../models_characters/dragon";
import { Egg } from "../models_props/egg";
import { MathStateI, StructureI } from "../../typings";
import { MathState } from "../gameControl/mathState";
import { Ogre } from "../models_characters/ogre";
import { Structure } from "../gameControl/structures";
import { farmUpgradeCostGold, farmUpgradeMax, mineUpgradeCostFarmers, mineUpgradeCostGold, mineUpgradeMax, smithyUpgradeCostFarmers, smithyUpgradeCostGold, smithyUpgradeMax, timeToMakeOre, timeToMakeWeapon } from "../utils/MATHCONSTANTS";

export class PlayMode extends Scene {
    public mainCamera:FreeCamera;
    private _app:App;
    public mathState:MathStateI;
    public smithy: StructureI;

    //gamepieces 
    private _hill:StructureModel;

    //interacative
    public castle:StructureModel;

    public farm01:Structure;
    public farm02:Structure;
    public farm03:Structure;
    public farm04:Structure;
    public farms:Structure[];
    
    public mine:StructureI;

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

        //temp camera for now TODO - MAKE GAME CAMERA
        this.mainCamera = new FreeCamera('cameraPlayScreen', new Vector3(-25,5,0), this);
        this.mainCamera.setTarget(new Vector3(0,4,0));

        //lights can be different for each scene
        //TODO Make all the background art swappable. It's a small app.
        const mainLight = new DirectionalLight('mainLight', new Vector3(1,-1,1),this);
        mainLight.intensity = 2;

        //load the starter Castle and position on hill
        this.castle = new StructureModel('Castle', this, castleModels, castlClickBox, castlePos );
        this.castle.position = castlePos;

        //load the entry level farms
        this.farm01 = new Structure('Farm01', this, {upgradeCostOfGold:farmUpgradeCostGold, upgradeCostFarmers:null, timeToMakeProduct:null}, farmUpgradeMax, null, farmModels, farmClickBox, Farm01Pos, null);
        this.farm01.structureModels.position = Farm01Pos;
        this.farm01.upgradeState();
        //these start out of view
        this.farm02 = new Structure('Farm02', this, {upgradeCostOfGold:farmUpgradeCostGold, upgradeCostFarmers:null, timeToMakeProduct:null}, farmUpgradeMax, null, farmModels, farmClickBox, Farm01Pos, null)
        this.farm02.structureModels.position = Farm02Pos;
        
        this.farm03 = new Structure('Farm03', this, {upgradeCostOfGold:farmUpgradeCostGold, upgradeCostFarmers:null, timeToMakeProduct:null}, farmUpgradeMax, null, farmModels, farmClickBox, Farm01Pos, null)
        this.farm03.structureModels.position = Farm03Pos;

        this.farm04 = new Structure('Farm04', this, {upgradeCostOfGold:farmUpgradeCostGold, upgradeCostFarmers:null, timeToMakeProduct:null}, farmUpgradeMax, null, farmModels, farmClickBox, Farm01Pos, null)
        this.farm04.structureModels.position = Farm04Pos;

        this.farms = [];
        this.farms.push(this.farm01,this.farm02,this.farm03,this.farm04);

        this.mine = new Structure('Mine', this, {upgradeCostOfGold:mineUpgradeCostGold, upgradeCostFarmers:mineUpgradeCostFarmers, timeToMakeProduct:timeToMakeOre}, mineUpgradeMax, 'Ore', mineModels, mineClickBox, minePos, 'miners');    
        this.mine.structureModels.position = new Vector3(minePos.x, minePos.y - 10 , minePos.z);
        console.log('mine upgrade level:', this.mine.upgradeLevel);
        this.smithy = new Structure('Smithy', this, {upgradeCostOfGold:smithyUpgradeCostGold, upgradeCostFarmers:smithyUpgradeCostFarmers, timeToMakeProduct:timeToMakeWeapon}, smithyUpgradeMax, 'Weapons', smithyModels, smithyClickBox, smithyPos, 'blacksmiths');
        this.smithy.structureModels.position = new Vector3(smithyPos.x, smithyPos.y -20, smithyPos.z);

        //Characters TODO- Add them all so they should be cloned.
        this.dragon = new Dragon('Dragon', this);
        this.dragon.position = new Vector3(0,-10,0);
        this.egg = new Egg('egg', this, this._app.gui as GUIPlay, this.dragon);
        
        this.ogre = new Ogre('ogre', this);

        //load the hill
        this._hill = new StructureModel('Hill', this, hillModels, null, Vector3.Zero());
    
        //load the background
        const background = new PlainsBackground(this);

        this.mathState = new MathState(this);

        //interact with the scene
        this.onPointerDown = function castRay() {
            const ray = this.createPickingRay(this.pointerX, this.pointerY, Matrix.Identity(), this.mainCamera);

            const hit = this.pickWithRay(ray);

            if (hit.pickedMesh === this.farm01.structureModels.clickZone || hit.pickedMesh === this.farm02.structureModels.clickZone ) {
                console.log('Farm Clicked');
                this._app.gui.showUpgrades(this._app.gui.GUIWrapperFarmUpgrade);
            }

            if (hit.pickedMesh === this.castle.clickZone) {
                console.log('Castle Clicked');
                this._app.gui.showUpgrades(this._app.gui.GUIWrapperCastleUpgrade);
            }

            if (hit.pickedMesh === this.mine.structureModels.clickZone) {
                console.log('Mine Clicked');
                this._app.gui.showUpgrades(this._app.gui.wrapperMineUpgrade);
            }

            if (hit.pickedMesh === this.smithy.structureModels.clickZone) {
                console.log("Structure Clicked");
                this._app.gui.showUpgrades(this._app.gui.wrapperSmithyUpgrade);
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