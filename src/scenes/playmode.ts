import { Engine, Scene, Vector3, FreeCamera, Color4, DirectionalLight, Matrix} from "@babylonjs/core";
import { barracksPos, castlClickBox, castleModels, castlePos, towerPos, DEBUGMODE, Farm01Pos, Farm02Pos, Farm03Pos, Farm04Pos, hillModels, minePos, forgePos, thievesGuildPos, tavernPos, workShopPos } from "../utils/CONSTANTS";
import { GUIPlay } from "../GUI/GUIPlay";
import { App } from "../app";
import { StructureModel } from "../models_structures/structureModels";
import { PlainsBackground } from "../models_backgrounds/plains_background";
import { Dragon } from "../models_characters/dragon";
import { Egg } from "../models_props/egg";
import { MathStateI, StructureStateChildI, StructureStateI } from "../../typings";
import { MathState } from "../gameControl/mathState";
import { Ogre } from "../models_characters/ogre";
import { AddFarmerUpgradeState } from "../upgradesEpic/addFarmerUpgradeState";
import { BaseGoldPercentUpgradeState } from "../upgradesEpic/baseGoldPercentUpgradeState";
import { StructureFarm01 } from "../structures/structureFarm01";
import { StructureFarm02 } from "../structures/structureFarm02";
import { StructureFarm03 } from "../structures/structureFarm03";
import { StructureFarm04 } from "../structures/structureFarm04";
import { StructureMine } from "../structures/structureMine";
import { StructureForge } from "../structures/structureForge";
import { StructureBarracks } from "../structures/structureBarracks";
import { StructureThievesGuild } from "../structures/structureThievesGuild";
import { StructureWorkShop } from "../structures/structureWorkshop";
import { StructureTower } from "../structures/structureTower";
import { StructureTavern } from "../structures/structureTavern";
import { BaseResourcePercentUpgradeState } from "../upgradesEpic/baseResourcePercentState";
import { StructuresFasterCyclesState } from "../upgradesEpic/structureFasterCycle";

export class PlayMode extends Scene {
    public mainCamera:FreeCamera;
    private _app:App;
    public mathState:MathStateI;

    //gamepieces 
    private _hill:StructureModel;

    //interacative
    public castle:StructureModel;

    public farm01:StructureFarm01;
    public farm02:StructureFarm02;
    public farm03:StructureFarm03;
    public farm04:StructureFarm04;
    public farms:StructureStateChildI[];
    
    public mine:StructureMine;
    public forge: StructureForge;
    public barracks:StructureBarracks;
    public thievesGuild:StructureThievesGuild;
    public workShop:StructureWorkShop;
    public tower:StructureTower;
    public tavern:StructureTavern;

    public allStructures:StructureStateI[];

    //Epic upgrades
    public epicAddFarmersUpgrade:AddFarmerUpgradeState;
    public epicUpgradeBaseGold:BaseGoldPercentUpgradeState;
    public epicUpgradeBaseResource:BaseResourcePercentUpgradeState;
    public epicFasterCycleTimes:StructuresFasterCyclesState;

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
        // this.farms = [];
        // this.farm01 = new StructureFarm01(this );
        // this.farm01.getStructureModels().position = Farm01Pos;
        // this.farm01.upgradeState();
        // //these start out of view
        // this.farm02 = new StructureFarm02(this)
        // this.farm02.getStructureModels().position = Farm02Pos;
        
        // this.farm03 = new StructureFarm03(this)
        // this.farm03.getStructureModels().position = Farm03Pos;

        // this.farm04 = new StructureFarm04(this)
        // this.farm04.getStructureModels().position = Farm04Pos;

        // this.farms.push(this.farm01,this.farm02,this.farm03,this.farm04);

        this.mine = new StructureMine(this);    
        this.mine.getStructureModels().position = new Vector3(minePos.x, minePos.y - 10 , minePos.z);

        this.forge = new StructureForge(this);
        this.forge.getStructureModels().position = new Vector3(forgePos.x, forgePos.y -20, forgePos.z);

        this.barracks = new StructureBarracks( this); 
        this.barracks.getStructureModels().position = new Vector3(barracksPos.x, barracksPos.y -20, barracksPos.z);
        
        this.thievesGuild = new StructureThievesGuild(this );
        this.thievesGuild.getStructureModels().position = new Vector3(thievesGuildPos.x, thievesGuildPos.y -20, thievesGuildPos.z);

        this.workShop = new StructureWorkShop( this );
        this.workShop.getStructureModels().position = new Vector3(workShopPos.x, workShopPos.y -20, workShopPos.z);

        this.tower = new StructureTower(this );
        this.tower.getStructureModels().position = new Vector3(towerPos.x, towerPos.y -20, towerPos.z);
        this.tower.getStructureModels().rotation.y = -45;

        this.tavern  = new StructureTavern(this);
        this.tavern.getStructureModels().position = new Vector3(tavernPos.x, tavernPos.y -20, tavernPos.z);

        this.allStructures = []
        this.allStructures.push(this.mine, this.forge, this.barracks, this.thievesGuild, this.workShop, this.tower, this.tavern);

        //Characters TODO- Add them all so they should be cloned.
        this.dragon = new Dragon('Dragon', this);
        this.dragon.position = new Vector3(0,-10,0);
        this.egg = new Egg('egg', this, this._app.gui as GUIPlay, this.dragon);
        
        this.ogre = new Ogre('ogre', this);

        //load the hill
        this._hill = new StructureModel('Hill', this, hillModels, null, Vector3.Zero());
    
        //load the background
        const background = new PlainsBackground(this);
        
        //epic upgrades
        this.epicAddFarmersUpgrade = new AddFarmerUpgradeState('Add Farmers');
        this.epicUpgradeBaseGold = new BaseGoldPercentUpgradeState('Base Gold', this);
        this.epicUpgradeBaseResource = new BaseResourcePercentUpgradeState('Base Resource',this);
        this.epicFasterCycleTimes = new StructuresFasterCyclesState('Cycle Times', this)

        this.mathState = new MathState(this);

        //interact with the scene
        this.onPointerDown = function castRay() {
            const ray = this.createPickingRay(this.pointerX, this.pointerY, Matrix.Identity(), this.mainCamera);

            const hit = this.pickWithRay(ray);

            // if (hit.pickedMesh === this.farm01.getStructureModels().clickZone || hit.pickedMesh === this.farm02.getStructureModels().clickZone ) {
                
            //     if (DEBUGMODE) {
            //         console.log('Farm Clicked');
            //     }

            //     console.log(this.farm01.getUpgradesWindow());
            //     this.farm01.getUpgradesWindow().showWindow();

            // }

            if (hit.pickedMesh === this.castle.clickZone) {
                
                if (DEBUGMODE) {
                    console.log('Castle Clicked');
                }

                this._app.gui.castleUpgradeWindow.showWindow();
            }

            if (hit.pickedMesh === this.mine.getStructureModels().clickZone) {
                
                if (DEBUGMODE) {
                    console.log('Mine Clicked');
                }

                this.mine.getUpgradesWindow().showWindow();
      
            }

            if (hit.pickedMesh === this.forge.getStructureModels().clickZone) {
                
                if (DEBUGMODE) {
                    console.log("Forge Clicked");
                }
                
                this.forge.getUpgradesWindow().showWindow();;
            }

            if (hit.pickedMesh === this.barracks.getStructureModels().clickZone) {
                
                if (DEBUGMODE) {
                    console.log("Barracks Clicked");
                }
                
                this.barracks.getUpgradesWindow().showWindow();
            }

            if (hit.pickedMesh === this.thievesGuild.getStructureModels().clickZone) {
                
                if (DEBUGMODE) {
                    console.log("Thieves Guild Clicked");
                }
                
                this.thievesGuild.getUpgradesWindow().showWindow();
            }

            if (hit.pickedMesh === this.workShop.getStructureModels().clickZone) {
                
                if (DEBUGMODE) {
                    console.log("Workshop Clicked");
                }
                
                this.workShop.getUpgradesWindow().showWindow();
            }

            if (hit.pickedMesh === this.tower.getStructureModels().clickZone) {
                
                if (DEBUGMODE) {
                    console.log("Tower Clicked");
                }
                
                this.tower.getUpgradesWindow().showWindow();
            }

            if (hit.pickedMesh === this.tavern.getStructureModels().clickZone) {
                
                if (DEBUGMODE) {
                    console.log("Tavern Clicked");
                }
                
                this.tavern.getUpgradesWindow().showWindow();
            }
            

            if (hit.pickedMesh === this.dragon.clickBox.meshes.allMeshes[0]) {
                
                if (DEBUGMODE) {
                    console.log('Dragon Clicked');
                }
                
                if (this.dragon.clickable) {
                    this.egg.runAnimation();
                    this.dragon.makeUnclickable();    
                }
            }

            if (hit.pickedMesh === this.ogre.clickBox.meshes.allMeshes[0]) {
                
                if (DEBUGMODE) {
                    console.log('Ogre Clicked');
                }

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

    public getApp() {
        return this._app;
    }

    public getAppGui() {
        return this._app.gui;
    }

}