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
import { StructureFarms } from "../structures/structureFarms";

export class PlayMode extends Scene {
    public mainCamera:FreeCamera;
    private _app:App;
    public mathState:MathStateI;

    //gamepieces 
    private _hill:StructureModel;

    //interacative
    public castle:StructureModel;

    public farms:StructureFarms;
    
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
    public allEpicUpgrades:any[];
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
        this.farms = new StructureFarms(this);

        this.mine = new StructureMine(this);    

        this.forge = new StructureForge(this);

        this.barracks = new StructureBarracks( this); 

        this.thievesGuild = new StructureThievesGuild(this );

        this.workShop = new StructureWorkShop( this );

        this.tower = new StructureTower(this );

        this.tavern  = new StructureTavern(this);

        this.allStructures = []
        this.allStructures.push(this.farms, this.mine, this.forge, this.barracks, this.thievesGuild, this.workShop, this.tower, this.tavern);

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
        this.allEpicUpgrades = []
        this.epicAddFarmersUpgrade = new AddFarmerUpgradeState('Add Farmers');
        this.epicUpgradeBaseGold = new BaseGoldPercentUpgradeState('Base Gold', this);
        this.epicUpgradeBaseResource = new BaseResourcePercentUpgradeState('Base Resource',this);
        this.epicFasterCycleTimes = new StructuresFasterCyclesState('Cycle Times', this)

        this.allEpicUpgrades.push(this.epicAddFarmersUpgrade,this.epicUpgradeBaseGold,this.epicUpgradeBaseResource,this.epicFasterCycleTimes);

        //load the mathState
        this.mathState = new MathState(this);
        console.log('mathstate:', this.mathState)

        //interact with the scene
        this.onPointerDown = function castRay() {
            const ray = this.createPickingRay(this.pointerX, this.pointerY, Matrix.Identity(), this.mainCamera);

            const hit = this.pickWithRay(ray);

            if (hit.pickedMesh === this.farms.getFarm01().models.clickZone || hit.pickedMesh === this.farms.getFarm02().models.clickZone ) {
                
                if (DEBUGMODE) {
                    console.log('Farm Clicked');
                    console.log(this.farms.getUpgradesWindow())
                }

                this.farms.getUpgradesWindow().showWindow();

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

                if (!this.mine.getSteward()) {
                    this.mine.getInSceneGui().requestBarMove();
                }
      
            }

            if (hit.pickedMesh === this.forge.getStructureModels().clickZone) {
                
                if (DEBUGMODE) {
                    console.log("Forge Clicked");
                }
                
                if (!this.forge.getSteward()) {
                    this.forge.getInSceneGui().requestBarMove();
                }
      
            }

            if (hit.pickedMesh === this.barracks.getStructureModels().clickZone) {
                
                if (DEBUGMODE) {
                    console.log("Barracks Clicked");
                }
                
                if (!this.forge.getSteward()) {
                    this.forge.getInSceneGui().requestBarMove();
                }
      
            }

            if (hit.pickedMesh === this.thievesGuild.getStructureModels().clickZone) {
                
                if (DEBUGMODE) {
                    console.log("Thieves Guild Clicked");
                }
                
                if (!this.thievesGuild.getSteward()) {
                    this.thievesGuild.getInSceneGui().requestBarMove();
                }
      
            }

            if (hit.pickedMesh === this.workShop.getStructureModels().clickZone) {
                
                if (DEBUGMODE) {
                    console.log("Workshop Clicked");
                }
                
                if (!this.workShop.getSteward()) {
                    this.workShop.getInSceneGui().requestBarMove();
                }
      
            }

            if (hit.pickedMesh === this.tower.getStructureModels().clickZone) {
                
                if (DEBUGMODE) {
                    console.log("Tower Clicked");
                }
                
                if (!this.tower.getSteward()) {
                    this.tower.getInSceneGui().requestBarMove();
                }
      
            }

            if (hit.pickedMesh === this.tavern.getStructureModels().clickZone) {
                
                if (DEBUGMODE) {
                    console.log("Tavern Clicked");
                }
                
                if (!this.tavern.getSteward()) {
                    this.tavern.getInSceneGui().requestBarMove();
                }
      
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