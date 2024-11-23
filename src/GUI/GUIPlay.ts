import { AdvancedDynamicTexture,  Button, Rectangle, Control, TextBlock} from "@babylonjs/gui";
import { castleToFarmPaths, DEBUGMODE, GUIFONT1, modelsDir } from "../utils/CONSTANTS";
import { PlayMode } from "../scenes/playmode";
import { UpgradeWindow } from "./upgradeWindow";
import { GameStateObserverI, GameStateI, MathStateObserverI, MathStateI, GUIResourceCounterI, StructureStateObserverOnCycleI, ResourcesT, GUIPlayI } from "../../typings";
import { App } from "../app";
import { StartScreen } from "../scenes/start_screen";
import { Runner } from "../models_characters/runners";
import { ResourceCounter } from "./resourceCounter";
import { EpicUpgradeWindow } from "./epicUpgrades/epicUpgradeWindow";
import { CastleUpgradeWindow } from "./castleUpgrades/CastleUpgradeWindow";

export class GUIPlay implements GUIPlayI ,GameStateObserverI, MathStateObserverI, StructureStateObserverOnCycleI {
    private _app:App;
    private _gameState:GameStateI;
    private _mathState:MathStateI;
    public name:string;
    public scene:PlayMode;
 
    //GUI
    public gameGUI:AdvancedDynamicTexture;
    
    //Top
    private _wrapperTop:Rectangle;
    private _farmersCount:GUIResourceCounterI;
    private _goldPerSecondCount:GUIResourceCounterI;
    private _goldCount:GUIResourceCounterI;
    private _lumenCount:GUIResourceCounterI;
    private _oreCount:GUIResourceCounterI;
    private _weaponCount:GUIResourceCounterI;
    private _villageCount:GUIResourceCounterI;
    private _lootCount:GUIResourceCounterI;
    private _goldBarsCount:GUIResourceCounterI;
    private _portalsCount:GUIResourceCounterI;
    private _relicsCount:GUIResourceCounterI;


    //Bottom
    private _playGUIWrapperBottom:Rectangle;
    private _epicUpgradesBtn
    private _addFarmerBtn:Button;

    //epic
    public epicUpgradeWindow:EpicUpgradeWindow;
    
    //castle TODO move this to a structure
    public castleUpgradeWindow:UpgradeWindow;

    constructor(app:App, scene:PlayMode) {
        this.name='GUIPlay';
        this._app = app;
        this.scene = scene;
        this._mathState = this.scene.mathState
        this._mathState.attach(this);
        this._app.gameState.attach(this);
        
        //GUI//
        this.gameGUI = AdvancedDynamicTexture.CreateFullscreenUI('GameGui')
        this.gameGUI.idealHeight = 1080;
        this.gameGUI.idealWidth = 1920;

        for (let i in this.scene.allStructures) {
            const structure = this.scene.allStructures[i];
            //observers
            structure.attachObserversCycle(this);
            
            //in Scene UI
            if (!structure.getName().includes('Farms')) {
                this.gameGUI.addControl(structure.getInSceneGui());
                structure.getInSceneGui().linkWithMesh(structure.getStructureModels());
            }

            //UpgradeWindows

            this.gameGUI.addControl(structure.getUpgradesWindow());

        
        }
        
        //TOP
        //playGUITop
        this._wrapperTop = new Rectangle('playGUIWrapperTop');
        this._wrapperTop.width = 0.8;
        this._wrapperTop.height= 0.12;
        this._wrapperTop.thickness = 1;
        this._wrapperTop.top = -400;
        this.gameGUI.addControl(this._wrapperTop);

        //Resources
        this._farmersCount = new ResourceCounter('Farmers', 0, 0, `${this._mathState.getTotalFarmers().toFixed()}`, this._wrapperTop);
        this._goldPerSecondCount = new ResourceCounter('Gold/Second', 24, 0, `${this._mathState.getGoldPerSecond()}`, this._wrapperTop);
        this._goldCount = new ResourceCounter('Gold', 48, 0, `${this._mathState.getTotalGold()}`, this._wrapperTop);
        this._lumenCount = new ResourceCounter('Lumens', 0, -300, `${this._mathState.getTotalLumens()}`, this._wrapperTop);
        this._oreCount = new ResourceCounter('Ore', 0, 300, `${this.scene.mine.getTotalResourceAmount()}`, this._wrapperTop);
        this._weaponCount = new ResourceCounter('Weapons', 24, 300,`${this.scene.forge.getTotalResourceAmount()}`, this._wrapperTop);
        this._villageCount = new ResourceCounter('Villages', 48, 300, `${this.scene.barracks.getTotalResourceAmount()}`, this._wrapperTop);
        this._lootCount = new ResourceCounter('Loot', 72, 300, `${this.scene.thievesGuild.getTotalResourceAmount()}`, this._wrapperTop);
        this._goldBarsCount = new ResourceCounter('Goldbars', 0, 600, `${this.scene.workShop.getTotalResourceAmount()}`, this._wrapperTop);
        this._portalsCount = new ResourceCounter('Portals', 24, 600, `${this.scene.tower.getTotalResourceAmount()}`, this._wrapperTop);
        this._relicsCount = new ResourceCounter('Relics', 48, 600, `${this.scene.tavern.getTotalResourceAmount()}`, this._wrapperTop);

        //Bottom
        //playGUIBottom
        this._playGUIWrapperBottom = new Rectangle('playGUIWrapperBottom');
        this._playGUIWrapperBottom.width = 0.8;
        this._playGUIWrapperBottom.height= 0.1;
        this._playGUIWrapperBottom.thickness = 1;
        this._playGUIWrapperBottom.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.gameGUI.addControl(this._playGUIWrapperBottom);

        //epic Upgrades Button
        this._epicUpgradesBtn = Button.CreateSimpleButton('epicUpgrades', "Epic Upgrades");
        this._epicUpgradesBtn.fontFamily = GUIFONT1;
        this._epicUpgradesBtn.width = 0.1;
        this._epicUpgradesBtn.height = 1;
        this._epicUpgradesBtn.color = 'white';
        this._epicUpgradesBtn.background = 'green';
        this._epicUpgradesBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this._epicUpgradesBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

        this._playGUIWrapperBottom.addControl(this._epicUpgradesBtn);

        this._epicUpgradesBtn.onPointerDownObservable.add(() => {

            console.log(this.epicUpgradeWindow);
            this.epicUpgradeWindow.showWindow();
        
        });


        //add Farmer button
        this._addFarmerBtn = Button.CreateSimpleButton("addFarmer", "Add Farmer");
        this._addFarmerBtn.fontFamily = GUIFONT1;
        this._addFarmerBtn.width = 0.2
        this._addFarmerBtn.height = "40px";
        this._addFarmerBtn.color = "white";
        this._addFarmerBtn.thickness = 2;
        this._addFarmerBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        
        this._playGUIWrapperBottom.addControl(this._addFarmerBtn);

        this._addFarmerBtn.onPointerDownObservable.add(() => {
            
            this._clickFunction();
        
        });

        //Epic Upgrades
        this.epicUpgradeWindow = new EpicUpgradeWindow('EpicUpgradeWindow', this.scene);
        this.gameGUI.addControl(this.epicUpgradeWindow);

        //Castle Upgrades
        //this is the GUI that Appears when you click on the Castle to upgrade
        this.castleUpgradeWindow = new CastleUpgradeWindow('castleUpgradeWindow', this.scene);

        //this.castleUpgradeWindow.isVisible = true;
        this.gameGUI.addControl(this.castleUpgradeWindow);


        if (DEBUGMODE) {
            console.log('In Playmode, this should be the last thing to load if true: GOOD!');
        }
    }

    private _clickFunction(){
        if (DEBUGMODE) {
            console.log('Add Farmer Button Clicked');
            console.log('mathStateFarmerMult: ', this.scene.epicAddFarmersUpgrade.getCurrentValue());
        }
            
        //make a farmer
        this._makeFarmer(this.scene.epicAddFarmersUpgrade.getCurrentValue());  
    }

    //this is the observer function to the MathState Class
    public updateMathState(mathState: MathStateI): void {
        
        //Everytime the MathState Class runs the game loop these update.
        this._farmersCount.setText(`${mathState.getTotalFarmers().toFixed()}`);
        this._goldPerSecondCount.setText(`${mathState.getGoldPerSecond().toFixed(4)}`);
        this._goldCount.setText(`${mathState.getTotalGold().toFixed(4)}`);
        this._lumenCount.setText(`${this._mathState.getTotalLumens().toFixed()}`);
    }

    public updateStructureOnCycle(resource: ResourcesT, resourceAmount: number): void {
        if (DEBUGMODE) {
            console.log(`${this.name} is running ${resource} cycle`);
        }

        switch (resource) {
            case 'Ore': {
                this._oreCount.setText(`${resourceAmount.toFixed(3)}`);
            }
            break;

            case 'Weapons' : {
                this._weaponCount.setText(`${resourceAmount.toFixed(3)}`);
            }
            break;

            case 'Villages': {
                this._villageCount.setText(`${resourceAmount.toFixed(3)}`);
            }
            break;

            case 'Loot' : {
                this._lootCount.setText(`${resourceAmount.toFixed(3)}`);
            }
            break;

            case 'Goldbars' : {
                this._goldBarsCount.setText(`${resourceAmount.toFixed(3)}`);
            }
            break;

            case 'Portals': {
                this._portalsCount.setText(`${resourceAmount.toFixed(3)}`);
            }
            break;

            case 'Relics' : {
                this._relicsCount.setText(`${resourceAmount.toFixed(3)}`);
            }
            break;

        }

    }

    //GUI functions
    public showUpgrades(wrapper:Rectangle) {
        
        if (!wrapper.isVisible) {
            
            wrapper.isVisible = true;
        
        }
    }
    
    //Game interaction functions
    private _makeFarmer(amount:number) {
        let totalFarmers = this._mathState.getTotalFarmers();
        let runningFarmers = this._mathState.getRunningFarmers();
        const farmersMax = this._mathState.getFarmersMax();
        let currentCount = totalFarmers + runningFarmers;

        //first check if we are maxed out on farmers
        if(currentCount < farmersMax) { 
            let maxPossibleRunners = Math.min(amount, farmersMax - currentCount);
            let intervalCount = maxPossibleRunners;
            
            let runnerInterval = setInterval(() => {
                currentCount = this._mathState.getTotalFarmers() + this._mathState.getRunningFarmers();

                if(currentCount < farmersMax && intervalCount > 0) {
                    //let the mathstate know there is 1 runner
                    this._mathState.makeFarmerRun(1);
                    
                    new Runner('farmer', currentCount, modelsDir, 'farmer.glb', this.scene, 0, castleToFarmPaths, () => {this.scene.mathState.addFarmers(1); this._mathState.endFarmerRun()});
                    
                    intervalCount -= 1;

                }

                if(intervalCount <= 0 || currentCount >= farmersMax) {
                    clearInterval(runnerInterval);
                }
            
            }, 250);
     
        }  
    }


    public updateGameState(): void {
        
        if(this._gameState.state === 'END_SCREEN') {
            if (DEBUGMODE) {
                console.log('Game going to EndScreen');
            }
        }
        if(this._gameState.state === 'START_SCREEN') {
            if (DEBUGMODE) {
                console.log('Game going to StartScreen');
            }
            this._app.switchScene(new StartScreen(this._app.engine));
        }

    }

    public getUpgradeWindow(window: string): UpgradeWindow {
        const upgradeWindow = this.gameGUI.getControlByName(window) as UpgradeWindow;
        return upgradeWindow;
    }

    private async _waitSceneLoad():Promise<void> {
        await this.scene.whenReadyAsync()
        .then(() => {

        })
    }

}