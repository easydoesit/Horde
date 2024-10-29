import { Engine, Scene, Vector3, FreeCamera, Color4, DirectionalLight, Matrix} from "@babylonjs/core";
import { castlClickBox, castleModels, castlePos, DEBUGMODE, hillModels } from "../utils/CONSTANTS";
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
import { WheatState } from "../upgradesStandard/wheat";
import { increaseOreValue } from "../utils/STANDARDUPGRADESCONSTANTS";
import { IncreaseOreValueState } from "../upgradesStandard/increaseOreVal";
import { IncreaseMiningSpeedState } from "../upgradesStandard/increaseMiningSpeed";

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

    public allStructures:StructureStateChildI[];

    //standard upgrades
    public wheat:WheatState;
    public increaseOreValue:IncreaseOreValueState;
    public increaseMiningSpeed:IncreaseMiningSpeedState;

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

        //load the entry level structures as hidden
        this.farms = [];
        this.farm01 = new StructureFarm01(this);
        this.farm01.getStructureModels().position = this.farm01.getStructureModels().gamePosition;
        
        //Once imported all of these are moved out of view.
        this.farm02 = new StructureFarm02(this);
        const farm02Position  = this.farm02.getStructureModels().position;
        this.farm02.getStructureModels().position = new Vector3(farm02Position.x, farm02Position.y - 20 , farm02Position.z);
        
        this.farm03 = new StructureFarm03(this)
        const farm03Position  = this.farm03.getStructureModels().position;
        this.farm03.getStructureModels().position = new Vector3(farm03Position.x, farm03Position.y - 20 , farm03Position.z);

        this.farm04 = new StructureFarm04(this)
        const farm04Position  = this.farm04.getStructureModels().position;
        this.farm04.getStructureModels().position = new Vector3(farm04Position.x, farm04Position.y - 20 , farm04Position.z);
        
        this.farms.push(this.farm01, this.farm02, this.farm03, this.farm04);

        this.mine = new StructureMine(this);    
        const minePosition  = this.mine.getStructureModels().position;
        this.mine.getStructureModels().position = new Vector3(minePosition.x, minePosition.y - 20 , minePosition.z);

        this.forge = new StructureForge(this);
        const forgePosition  = this.forge.getStructureModels().position;
        this.forge.getStructureModels().position = new Vector3(forgePosition.x, forgePosition.y - 20 , forgePosition.z);

        this.barracks = new StructureBarracks( this); 
        const barracksPosition  = this.barracks.getStructureModels().position;
        this.barracks.getStructureModels().position = new Vector3(barracksPosition.x, barracksPosition.y - 20 , barracksPosition.z);

        this.thievesGuild = new StructureThievesGuild(this );
        const thievesGuildPosition  = this.thievesGuild.getStructureModels().position;
        this.thievesGuild.getStructureModels().position = new Vector3(thievesGuildPosition.x, thievesGuildPosition.y - 20 , thievesGuildPosition.z);

        this.workShop = new StructureWorkShop( this );
        const workShopPosition  = this.workShop.getStructureModels().position;
        this.workShop.getStructureModels().position = new Vector3(workShopPosition.x, workShopPosition.y - 20 , workShopPosition.z);

        this.tower = new StructureTower(this );
        const towerPosition  = this.tower.getStructureModels().position;
        this.tower.getStructureModels().position = new Vector3(towerPosition.x, towerPosition.y - 20 , towerPosition.z);


        this.tavern  = new StructureTavern(this);
        const tavernPosition  = this.tavern.getStructureModels().position;
        this.tavern.getStructureModels().position = new Vector3(tavernPosition.x, tavernPosition.y - 20 , tavernPosition.z);

        this.allStructures = []
        this.allStructures.push(...this.farms, this.mine, this.forge, this.barracks, this.thievesGuild, this.workShop, this.tower, this.tavern);

        //Characters TODO- Add them all so they should be cloned.
        this.dragon = new Dragon('Dragon', this);
        this.dragon.position = new Vector3(0,-10,0);
        this.egg = new Egg('egg', this, this._app.gui as GUIPlay, this.dragon);
        
        this.ogre = new Ogre('ogre', this);

        //load the hill
        this._hill = new StructureModel('Hill', this, hillModels, null, Vector3.Zero());
    
        //load the background
        const background = new PlainsBackground(this);

        //standardUpgrades
        this.wheat = new WheatState('Wheat', this);
        this.increaseOreValue = new IncreaseOreValueState('Increase Ore Value', this);
        this.increaseMiningSpeed = new IncreaseMiningSpeedState('Increase Mining Speed', this);

        //epic upgrades
        this.epicAddFarmersUpgrade = new AddFarmerUpgradeState('Add Farmers');
        this.epicUpgradeBaseGold = new BaseGoldPercentUpgradeState('Base Gold', this);
        this.epicUpgradeBaseResource = new BaseResourcePercentUpgradeState('Base Resource',this);
        this.epicFasterCycleTimes = new StructuresFasterCyclesState('Cycle Times', this)

        //load the mathState
        this.mathState = new MathState(this);

        //interact with the scene
        this.onPointerDown = function castRay() {
            const ray = this.createPickingRay(this.pointerX, this.pointerY, Matrix.Identity(), this.mainCamera);

            const hit = this.pickWithRay(ray);

            if (hit.pickedMesh === this.farm01.getStructureModels().clickZone || hit.pickedMesh === this.farm02.getStructureModels().clickZone ) {
                
                if (DEBUGMODE) {
                    console.log('Farm Clicked');
                }

                this.farm01.getUpgradesWindow().showWindow();

            }

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
        
        await this.whenReadyAsync()
        .then(() => {
            //change the GUI
            engine.hideLoadingUI();
        });
        
       
    }

    public getApp() {
        return this._app;
    }

    public getAppGui() {
        return this._app.gui;
    }

    public getStructure(name:string):StructureStateI {
        for (let i in this.allStructures) {
            const structure = this.allStructures[i];
            
            if (structure.getName() === name) {
                return structure;
            }
        }
        
    }

}