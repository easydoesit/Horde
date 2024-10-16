import { Engine, Scene, Vector3, FreeCamera, Color4, DirectionalLight, Matrix} from "@babylonjs/core";
import { barracksClickBox, barracksModels, barracksPos, castlClickBox, castleModels, castlePos, towerClickBox, towerModels, towerPos, DEBUGMODE, Farm01Pos, Farm02Pos, Farm03Pos, Farm04Pos, farmClickBox, farmModels, farmToBarracksPaths, farmToTowerPaths, farmToMinePaths, farmToForgePaths, farmToThievesGuildPaths, farmToTavernPaths, farmToWorkShopPaths, hillModels, mineClickBox, mineModels, minePos, forgeClickBox, forgeModels, forgePos, thievesGuildClickBox, thievesGuildModels, thievesGuildPos, tavernClickBox, tavernModels, tavernPos, workShopClickBox, workShopModels, workShopPos } from "../utils/CONSTANTS";
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
import { barracksUpgradeCostFarmers, barracksUpgradeCostGold, barracksUpgradeMax, towerUpgradeCostFarmers, towerUpgradeCostGold, towerUpgradeMax, farmUpgradeCostGold, farmUpgradeMax, mineUpgradeCostFarmers, mineUpgradeCostGold, mineUpgradeMax, forgeUpgradeCostFarmers, forgeUpgradeCostGold, forgeUpgradeMax, thievesGuildUpgradeCostFarmers, thievesGuildUpgradeCostGold, thievesGuildUpgradeMax, timeToMakeGoldBar, timeToMakeLoot, timeToMakeOre, timeToMakePortal, timeToMakeRelic, timeToMakeSoldier, timeToMakeWeapon, tavernUpgradeCostFarmers, tavernUpgradeCostGold, tavernUpgradeMax, workShopUpgradeCostFarmers, workShopUpgradeCostGold, workShopUpgradeMax } from "../utils/MATHCONSTANTS";
import { EpicUpgrade } from "../upgradesEpic/epicUpgrade";
import { addFarmersCostLumens, addFarmersMultInit, addFarmersMultMax, addFarmersValueIncrement } from "../utils/EPICUPGRADESCONSTANTS";

export class PlayMode extends Scene {
    public mainCamera:FreeCamera;
    private _app:App;
    public mathState:MathStateI;

    //gamepieces 
    private _hill:StructureModel;

    //interacative
    public castle:StructureModel;

    public farm01:StructureI;
    public farm02:StructureI;
    public farm03:StructureI;
    public farm04:StructureI;
    public farms:StructureI[];
    
    public mine:StructureI;
    public forge: StructureI;
    public barracks:StructureI;
    public thievesGuild:StructureI;
    public workShop:StructureI;
    public tower:StructureI;
    public tavern:StructureI;

    public allStructures:StructureI[];

    //Epic upgrades
    public addFarmersUpgrade:EpicUpgrade;

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
        this.farm01 = new Structure('Farm01', this, {upgradeCostOfGold:farmUpgradeCostGold, upgradeCostFarmers:null, timeToMakeProduct:null}, farmUpgradeMax, null, farmModels, farmClickBox, Farm01Pos, null, null);
        this.farm01.structureModels.position = Farm01Pos;
        this.farm01.upgradeState();
        //these start out of view
        this.farm02 = new Structure('Farm02', this, {upgradeCostOfGold:farmUpgradeCostGold, upgradeCostFarmers:null, timeToMakeProduct:null}, farmUpgradeMax, null, farmModels, farmClickBox, Farm01Pos, null, null)
        this.farm02.structureModels.position = Farm02Pos;
        
        this.farm03 = new Structure('Farm03', this, {upgradeCostOfGold:farmUpgradeCostGold, upgradeCostFarmers:null, timeToMakeProduct:null}, farmUpgradeMax, null, farmModels, farmClickBox, Farm01Pos, null, null)
        this.farm03.structureModels.position = Farm03Pos;

        this.farm04 = new Structure('Farm04', this, {upgradeCostOfGold:farmUpgradeCostGold, upgradeCostFarmers:null, timeToMakeProduct:null}, farmUpgradeMax, null, farmModels, farmClickBox, Farm01Pos, null, null)
        this.farm04.structureModels.position = Farm04Pos;

        this.farms = [];
        this.farms.push(this.farm01,this.farm02,this.farm03,this.farm04);

        this.mine = new Structure('Mine', this, {upgradeCostOfGold:mineUpgradeCostGold, upgradeCostFarmers:mineUpgradeCostFarmers, timeToMakeProduct:timeToMakeOre}, mineUpgradeMax, 'Ore', mineModels, mineClickBox, minePos, 'miner', farmToMinePaths);    
        this.mine.structureModels.position = new Vector3(minePos.x, minePos.y - 10 , minePos.z);

        this.forge = new Structure('Forge', this, {upgradeCostOfGold:forgeUpgradeCostGold, upgradeCostFarmers:forgeUpgradeCostFarmers, timeToMakeProduct:timeToMakeWeapon}, forgeUpgradeMax, 'Weapons', forgeModels, forgeClickBox, forgePos, 'blacksmith', farmToForgePaths);
        this.forge.structureModels.position = new Vector3(forgePos.x, forgePos.y -20, forgePos.z);

        this.barracks = new Structure('Barracks', this, {upgradeCostOfGold:barracksUpgradeCostGold, upgradeCostFarmers:barracksUpgradeCostFarmers, timeToMakeProduct:timeToMakeSoldier}, barracksUpgradeMax, 'Villages', barracksModels, barracksClickBox, barracksPos, 'soldier', farmToBarracksPaths); 
        this.barracks.structureModels.position = new Vector3(barracksPos.x, barracksPos.y -20, barracksPos.z);
        
        this.thievesGuild = new Structure('ThievesGuild', this, {upgradeCostOfGold:thievesGuildUpgradeCostGold, upgradeCostFarmers:thievesGuildUpgradeCostFarmers, timeToMakeProduct:timeToMakeLoot}, thievesGuildUpgradeMax, 'Loot', thievesGuildModels, thievesGuildClickBox, thievesGuildPos, 'thief', farmToThievesGuildPaths);
        this.thievesGuild.structureModels.position = new Vector3(thievesGuildPos.x, thievesGuildPos.y -20, thievesGuildPos.z);

        this.workShop = new Structure('WorkShop', this, {upgradeCostOfGold:workShopUpgradeCostGold, upgradeCostFarmers:workShopUpgradeCostFarmers, timeToMakeProduct:timeToMakeGoldBar}, workShopUpgradeMax, 'Goldbars', workShopModels, workShopClickBox, workShopPos, 'alchemist', farmToWorkShopPaths);
        this.workShop.structureModels.position = new Vector3(workShopPos.x, workShopPos.y -20, workShopPos.z);

        this.tower = new Structure('Tower', this, {upgradeCostOfGold:towerUpgradeCostGold, upgradeCostFarmers:towerUpgradeCostFarmers, timeToMakeProduct:timeToMakePortal}, towerUpgradeMax, 'Portals' , towerModels, towerClickBox, towerPos, 'wizard', farmToTowerPaths);
        this.tower.structureModels.position = new Vector3(towerPos.x, towerPos.y -20, towerPos.z);
        this.tower.structureModels.rotation.y = -45;

        this.tavern  = new Structure('Tavern', this, {upgradeCostOfGold:tavernUpgradeCostGold, upgradeCostFarmers:tavernUpgradeCostFarmers, timeToMakeProduct:timeToMakeRelic}, tavernUpgradeMax, 'Relics', tavernModels, tavernClickBox, tavernPos, 'adventurer', farmToTavernPaths );
        this.tavern.structureModels.position = new Vector3(tavernPos.x, tavernPos.y -20, tavernPos.z);

        this.allStructures = []
        this.allStructures.push(this.farm01, this.farm02,this.farm03,this.farm04,this.mine, this.forge, this.barracks, this.thievesGuild, this.workShop, this.tower, this.tavern);

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
        this.addFarmersUpgrade = new EpicUpgrade('Add Farmers', addFarmersCostLumens, addFarmersMultInit, addFarmersValueIncrement, addFarmersMultMax);

        //interact with the scene
        this.onPointerDown = function castRay() {
            const ray = this.createPickingRay(this.pointerX, this.pointerY, Matrix.Identity(), this.mainCamera);

            const hit = this.pickWithRay(ray);

            if (hit.pickedMesh === this.farm01.structureModels.clickZone || hit.pickedMesh === this.farm02.structureModels.clickZone ) {
                
                if (DEBUGMODE) {
                    console.log('Farm Clicked');
                }

                this._app.gui.showUpgrades(this._app.gui.GUIWrapperFarmUpgrade);
            }

            if (hit.pickedMesh === this.castle.clickZone) {
                
                if (DEBUGMODE) {
                    console.log('Castle Clicked');
                }

                this._app.gui.showUpgrades(this._app.gui.GUIWrapperCastleUpgrade);
            }

            if (hit.pickedMesh === this.mine.structureModels.clickZone) {
                
                if (DEBUGMODE) {
                    console.log('Mine Clicked');
                }

                this._app.gui.showUpgrades(this._app.gui.wrapperMineUpgrade);
            }

            if (hit.pickedMesh === this.forge.structureModels.clickZone) {
                
                if (DEBUGMODE) {
                    console.log("Forge Clicked");
                }
                
                this._app.gui.showUpgrades(this._app.gui.wrapperForgeUpgrade);
            }

            if (hit.pickedMesh === this.barracks.structureModels.clickZone) {
                
                if (DEBUGMODE) {
                    console.log("Barracks Clicked");
                }
                
                this._app.gui.showUpgrades(this._app.gui.wrapperBarracksUpgrade);
            }

            if (hit.pickedMesh === this.thievesGuild.structureModels.clickZone) {
                
                if (DEBUGMODE) {
                    console.log("Thieves Guild Clicked");
                }
                
                this._app.gui.showUpgrades(this._app.gui.wrapperThievesGuildUpgrade);
            }

            if (hit.pickedMesh === this.workShop.structureModels.clickZone) {
                
                if (DEBUGMODE) {
                    console.log("Workshop Clicked");
                }
                
                this._app.gui.showUpgrades(this._app.gui.wrapperWorkShopUpgrade);
            }

            if (hit.pickedMesh === this.tower.structureModels.clickZone) {
                
                if (DEBUGMODE) {
                    console.log("Tower Clicked");
                }
                
                this._app.gui.showUpgrades(this._app.gui.wrapperTowerUpgrade);
            }

            if (hit.pickedMesh === this.tavern.structureModels.clickZone) {
                
                if (DEBUGMODE) {
                    console.log("Tavern Clicked");
                }
                
                this._app.gui.showUpgrades(this._app.gui.wrapperTavernUpgrade);
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

}