import { AdvancedDynamicTexture,  Button, Rectangle, Control, TextBlock} from "@babylonjs/gui";
import { castleToFarmPaths, DEBUGMODE, GUIFONT1, modelsDir } from "../utils/CONSTANTS";
import { PlayMode } from "../scenes/playmode";
import { wheatUpgradesMax, wheatUpgradeValue, farmUpgradeMax, mineUpgradeMax, oreUpgradeValue, weaponUpgradeValue, forgeUpgradeMax, farmersMaxPerFarm, villagesUpgradeValue, barracksUpgradeMax, lootUpgradeValue, thievesGuildUpgradeMax, goldBarUpgradeValue, workShopUpgradeMax, portalUpgradeValue, towerUpgradeMax, relicUpgradeValue, tavernUpgradeMax } from "../utils/MATHCONSTANTS";
import { StructureUpgradeSection } from "./structureUpgrades/structureUpgradeSection";
import { UpgradeWindow } from "./upgradeWindow";
import { GameStateObserverI, GameStateI, MathStateObserverI, MathStateI, StructureStateI, GUIProductCounterI, StructureStateObserverOnCycleI, ProductsT, GUIPlayI } from "../../typings";
import { App } from "../app";
import { StartScreen } from "../scenes/start_screen";
import { AddStructureButton } from "./structureUpgrades/addStructureButton";
import { Runner } from "../models_characters/runners";
import { ProductCounter } from "./productCounter";
import { StructureFarm01 } from "../structures/structureFarm01";
import { StructureFarm02 } from "../structures/structureFarm02";
import { StructureFarm03 } from "../structures/structureFarm03";
import { StructureFarm04 } from "../structures/structureFarm04";
import { EpicUpgradeWindow } from "./EpicUpgrades/epicUpgradeWindow";
import { CastleUpgradeWindow } from "./CastleUpgrades/CastleUpgradeWindow";

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
    private _farmersCount:GUIProductCounterI;
    private _goldPerSecondCount:GUIProductCounterI;
    private _goldCount:GUIProductCounterI;
    private _lumenCount:GUIProductCounterI;
    private _oreCount:GUIProductCounterI;
    private _weaponCount:GUIProductCounterI;
    private _villageCount:GUIProductCounterI;
    private _lootCount:GUIProductCounterI;
    private _goldBarsCount:GUIProductCounterI;
    private _portalsCount:GUIProductCounterI;
    private _relicsCount:GUIProductCounterI;


    //Bottom
    private _playGUIWrapperBottom:Rectangle;
    private _epicUpgradesBtn
    private _addFarmerBtn:Button;

    //epic
    public epicUpgradeWindow:EpicUpgradeWindow;
    
    //castle
    public castleUpgradeWindow:UpgradeWindow;
 
    //farms
    public GUIWrapperFarmUpgrade:UpgradeWindow;
    public farmersMaxTextBox:TextBlock;
    private _wheatUpgrade:StructureUpgradeSection;
    private _farmUpgrade01Section:StructureUpgradeSection;
    private _farmUpgrade02Section:StructureUpgradeSection;
    private _farmUpgrade03Section:StructureUpgradeSection;
    private _farmUpgrade04Section:StructureUpgradeSection;
    private _farmUpgradeSections:StructureUpgradeSection[];
    private _addFarmButton02:AddStructureButton;
    private _addFarmButton03:AddStructureButton;
    private _addFarmButton04:AddStructureButton;
    private _addFarmButtons: AddStructureButton[];

  

    constructor(app:App, scene:PlayMode) {
        this.name='GUIPlay';
        this._app = app;
        this.scene = scene;
        this._mathState = this.scene.mathState
        this._mathState.attach(this);
        this._app.gameState.attach(this);
        
        this._farmUpgradeSections = [];//there are multiple farm upgrades so we need this array to hold them.
        
        //GUI//
        this.gameGUI = AdvancedDynamicTexture.CreateFullscreenUI('GameGui')
        this.gameGUI.idealHeight = 1080;
        this.gameGUI.idealWidth = 1920;

        for (let i in this.scene.allStructures) {
            const structure = this.scene.allStructures[i];
            //observers
            structure.attachObserversCycle(this);
            
            //in Scene UI
            if (!structure.getName().includes('Farm')) {
                this.gameGUI.addControl(structure.getInSceneGui());
                structure.getInSceneGui().linkWithMesh(structure.getStructureModels());
            }

            //UpgradeWindows
            if (!structure.getName().includes('Farm')) {
                this.gameGUI.addControl(structure.getUpgradesWindow());
            }

            if (structure.getName().includes('Farm01')) {
                this.gameGUI.addControl(structure.getUpgradesWindow());
            }
        
        }
        
        //TOP
        //playGUITop
        this._wrapperTop = new Rectangle('playGUIWrapperTop');
        this._wrapperTop.width = 0.8;
        this._wrapperTop.height= 0.12;
        this._wrapperTop.thickness = 1;
        this._wrapperTop.top = -400;
        this.gameGUI.addControl(this._wrapperTop);

        //Products
        this._farmersCount = new ProductCounter('Farmers', 0, 0, `${this._mathState.getTotalFarmers()}`, this._wrapperTop);
        this._goldPerSecondCount = new ProductCounter('Gold/Second', 24, 0, `${this._mathState.getGoldPerSecond()}`, this._wrapperTop);
        this._goldCount = new ProductCounter('Gold', 48, 0, `${this._mathState.getTotalGold()}`, this._wrapperTop);
        this._lumenCount = new ProductCounter('Lumens', 0, -300, `${this._mathState.getTotalLumens()}`, this._wrapperTop);
        this._oreCount = new ProductCounter('Ore', 0, 300, `${this.scene.mine.getTotalProductAmount()}`, this._wrapperTop);
        this._weaponCount = new ProductCounter('Weapons', 24, 300,`${this.scene.forge.getTotalProductAmount()}`, this._wrapperTop);
        this._villageCount = new ProductCounter('Villages', 48, 300, `${this.scene.barracks.getTotalProductAmount()}`, this._wrapperTop);
        this._lootCount = new ProductCounter('Loot', 72, 300, `${this.scene.thievesGuild.getTotalProductAmount()}`, this._wrapperTop);
        this._goldBarsCount = new ProductCounter('Goldbars', 0, 600, `${this.scene.workShop.getTotalProductAmount()}`, this._wrapperTop);
        this._portalsCount = new ProductCounter('Portals', 24, 600, `${this.scene.tower.getTotalProductAmount()}`, this._wrapperTop);
        this._relicsCount = new ProductCounter('Relics', 48, 600, `${this.scene.tavern.getTotalProductAmount()}`, this._wrapperTop);

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


        //Farm Upgrades
        //this is the GUI that Appears when you click on the Farm to upgrade

        // this.farmersMaxTextBox = new TextBlock('MaxFarmers', `Max Famers: ${this._mathState.getFarmersMax()}`);
        // this.farmersMaxTextBox.fontFamily = GUIFONT1;
        // this.farmersMaxTextBox.top = -430;
        // this.farmersMaxTextBox.width = .3;
        // this.farmersMaxTextBox.color= 'white';
        // this.GUIWrapperFarmUpgrade.addControl(this.farmersMaxTextBox);

        //this creates the wheat Upgrade section on the Farm Window
        //this._wheatUpgrade = new StructureUpgradeSection('wheatUpgrade', `adds %${wheatUpgradeValue * 100} gold/second`, this._mathState.costOfWheatUpgrade, null, wheatUpgradesMax, this.GUIWrapperFarmUpgrade, -320, this.scene, () => this.wheatUpgradeCallback());

        // //this creates the farm Upgrade section on the GUI
        // this._farmUpgrade01Section = new StructureUpgradeSection('Farm 01 Upgrades', `next Uprade allows ${this._checkUpgradeFarmersMax(this.scene.farm01)} farmers on this farm`, this.scene.farm01.getUpgradeCostGold(), null, farmUpgradeMax, this.GUIWrapperFarmUpgrade, -200, this.scene, () => this._farmUpgradeCallBack(this.scene.farm01));
        
        // this._farmUpgrade02Section = new StructureUpgradeSection('Farm 02 Upgrades', `next Uprade allows ${this._checkUpgradeFarmersMax(this.scene.farm02)} farmers on this farm`, this.scene.farm02.getUpgradeCostGold(), null, farmUpgradeMax, this.GUIWrapperFarmUpgrade, -80, this.scene, () => this._farmUpgradeCallBack(this.scene.farm02));
        // this._farmUpgrade02Section.wrapperUpgradeContainer.isVisible = false;
        
        // this._farmUpgrade03Section = new StructureUpgradeSection('Farm 03 Upgrades', `next Uprade allows ${this._checkUpgradeFarmersMax(this.scene.farm03)} farmers on this farm`, this.scene.farm03.getUpgradeCostGold(), null, farmUpgradeMax, this.GUIWrapperFarmUpgrade, 40, this.scene, () => this._farmUpgradeCallBack(this.scene.farm03));
        // this._farmUpgrade03Section.wrapperUpgradeContainer.isVisible = false;

        // this._farmUpgrade04Section = new StructureUpgradeSection('Farm 04 Upgrades', `next Uprade allows  ${this._checkUpgradeFarmersMax(this.scene.farm04)} farmers on this farm`, this.scene.farm04.getUpgradeCostGold(), null, farmUpgradeMax, this.GUIWrapperFarmUpgrade, 160, this.scene, () => this._farmUpgradeCallBack(this.scene.farm04));
        // this._farmUpgrade04Section.wrapperUpgradeContainer.isVisible = false;
        // this._farmUpgradeSections.push(this._farmUpgrade01Section, this._farmUpgrade02Section, this._farmUpgrade03Section, this._farmUpgrade04Section);
        
        //ADDFarm Buttons.
        // this._addFarmButtons =[];

        // this._addFarmButton02 = new AddStructureButton('addFarm02Button', this, this._farmUpgrade02Section,this.GUIWrapperFarmUpgrade as UpgradeWindow, -80, this.scene.farm02, () => this._farmAdditionCallback(this.GUIWrapperFarmUpgrade, 'addFarm03Button', this._farmUpgrade02Section, this.scene.farm02));
        // this.GUIWrapperFarmUpgrade.addControl(this._addFarmButton02);

        // this._addFarmButton03 = new AddStructureButton('addFarm03Button', this, this._farmUpgrade03Section,this.GUIWrapperFarmUpgrade as UpgradeWindow, 40, this.scene.farm03, () => this._farmAdditionCallback(this.GUIWrapperFarmUpgrade, 'addFarm04Button', this._farmUpgrade03Section, this.scene.farm03));
        // this._addFarmButton03.isEnabled = false;
        // this._addFarmButton03.isVisible = false;
        // this.GUIWrapperFarmUpgrade.addControl(this._addFarmButton03);

        // this._addFarmButton04 = new AddStructureButton('addFarm04Button', this, this._farmUpgrade04Section,this.GUIWrapperFarmUpgrade as UpgradeWindow, 160, this.scene.farm04, () => this._farmAdditionCallback(this.GUIWrapperFarmUpgrade, null, this._farmUpgrade04Section, this.scene.farm04));
        // this._addFarmButton04.isEnabled = false;
        // this._addFarmButton04.isVisible = false;
        // this.GUIWrapperFarmUpgrade.addControl(this._addFarmButton04);

        // this._addFarmButtons.push(this._addFarmButton02, this._addFarmButton03, this._addFarmButton04);

        //Castle Upgrades
        //this is the GUI that Appears when you click on the Castle to upgrade
        this.castleUpgradeWindow = new CastleUpgradeWindow('castleUpgradeWindow', this.scene);

        //this.castleUpgradeWindow.isVisible = true;
        this.gameGUI.addControl(this.castleUpgradeWindow);

        //GAMELOOP//
        this.scene.onBeforeRenderObservable.add(() => {
            
            //wheat
            //this._wheatUpgrade.upgradeAble = this._wheatUpgradeAllowed();

            //farms
            // for (let i in this._farmUpgradeSections) {
            //     this._farmUpgradeSections[i].upgradeAble = this._farmUpgradeAllowed(this.scene.farms[i]);
            // }
            
            // for (let i = 0; i < this._addFarmButtons.length; i++) {
                
            //     //there is 3 Add Farm Buttons but 4 Farms so the two arrays compare at different sizes
            //     if(this._addFarmButtons[i].isVisible && this._mathState.getTotalGold() >= this.scene.farms[i + 1].getUpgradeCostGold()) {
            //         this._addFarmButtons[i].isEnabled = true;
            //     } else if (this._addFarmButtons[i].isVisible && this._mathState.getTotalGold() < this.scene.farms[i + 1].getUpgradeCostGold()) {
            //         this._addFarmButtons[i].isEnabled = false;
            //     }
            
            // }

        });

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
        this._farmersCount.changeText(`${mathState.getTotalFarmers()}`);
        this._goldPerSecondCount.changeText(`${mathState.getGoldPerSecond().toFixed(3)}`);
        this._goldCount.changeText(`${mathState.getTotalGold().toFixed(3)}`);
        this._lumenCount.changeText(`${this._mathState.getTotalLumens()}`);
    }

    public updateStructureOnCycle(product: ProductsT, productAmount: number, goldPerCycle: number): void {
        if (DEBUGMODE) {
            console.log(`${this.name} is running ${product} cycle`);
        }

        switch (product) {
            case 'Ore': {
                this._oreCount.changeText(`${productAmount}`);
            }
            break;

            case 'Weapons' : {
                this._weaponCount.changeText(`${productAmount}`);
            }
            break;

            case 'Villages': {
                this._villageCount.changeText(`${productAmount}`);
            }
            break;

            case 'Loot' : {
                this._lootCount.changeText(`${productAmount}`);
            }
            break;

            case 'Goldbars' : {
                this._goldBarsCount.changeText(`${productAmount}`);
            }
            break;

            case 'Portals': {
                this._portalsCount.changeText(`${productAmount}`);
            }
            break;

            case 'Relics' : {
                this._relicsCount.changeText(`${productAmount}`);
            }
            break;

        }

    }


    //wheat
    private _wheatUpgradeAllowed() {
        if (this._mathState.getTotalGold() > this._mathState.costOfWheatUpgrade) {
            return true;
        } else {
            return false;
        }
    }

     //Wheat
     public wheatUpgradeCallback() {
    
        if (this._mathState.wheatValue < wheatUpgradeValue * wheatUpgradesMax) {
            if (this._mathState.getTotalGold() > this._mathState.costOfWheatUpgrade) {
            
            //apply the value changes
            this._mathState.changeWheatValue();
            this._mathState.changeGoldPerSecond();

            //use gold
            this._mathState.spendGold(this._mathState.costOfWheatUpgrade);
            
            //apply cost change
            this._mathState.upgradeWheat();
            this._mathState.changeCostOfWheatUpgrade();

            this._wheatUpgrade.changeGoldCost(this._mathState.costOfWheatUpgrade);

            }

        }
        
    }
    
    //farms
    private _farmUpgradeAllowed(farm:StructureStateI) {

        //this depends on whether the farm is completely upgraded or not.
        if (farm.getUpgradeLevel() < farmUpgradeMax) {
            
            if (this._mathState.getTotalGold() >= farm.getUpgradeCostGold()) {
                return true;
            } else {
                return false;
            }
        
        }
    }

    private _checkUpgradeFarmersMax(farm:StructureStateI) {
        let total = null;

        if (farm.getUpgradeLevel() < farmUpgradeMax) {
            total = Math.round(farmersMaxPerFarm(farm.getUpgradeLevel() + 1))
        } else {
            total = "Maxed out!";
        }

        return total;
    }

    // private _farmAdditionCallback(wrapper:Rectangle, nextButton:string | null, upgradeSection:StructureUpgradeSection, farm:StructureStateI) {
    //     //show the section in the GUI
    //     upgradeSection.wrapperUpgradeContainer.isVisible = true;

    //     //make the next add Farm Button Available
    //     if(nextButton !== null) {
    //         const searchedButton = wrapper.getChildByName(nextButton) as Button;
    //         searchedButton.isVisible = true;
    //     }

    //     //update the GUI
    //     for (let i in this._farmUpgradeSections) {
    //         this._farmUpgradeSections[i].instruction = `next Upgrade allows ${this._checkUpgradeFarmersMax(this.scene.farms[i])} farmers on this farm`
    //         this._farmUpgradeSections[i].textBlockUpgradeInstruction.text = this._farmUpgradeSections[i].instruction;
    //     }

    //     this.farmersMaxTextBox.text = `Max Farmers: ${this._mathState.getFarmersMax()}`;

    // }

    // private _farmUpgradeCallBack(farm:StructureFarm01 | StructureFarm02 | StructureFarm03 | StructureFarm04) {

    //     farm.upgradeState();

    //     for(let i in this._farmUpgradeSections) {
    //         this._farmUpgradeSections[i].changeGoldCost(this.scene.farms[i].getUpgradeCostGold());
    //     }

    //     this.farmersMaxTextBox.text = `Max Farmers: ${this._mathState.getFarmersMax()}`;

    // }
    
   

    //forge
    private _forgeUpgradeAllow() {
        if(this.scene.forge.getUpgradeLevel() < forgeUpgradeMax) {
            if(this._mathState.getTotalGold() > this.scene.forge.getUpgradeCostGold() && this._mathState.getTotalFarmers() > this.scene.forge.getUpgradeCostFarmers()) {
                return true;
            } else {
                return false;
            }
        }
    }


    //barracks
    private _barracksUpgradeAllow() {
        if(this.scene.barracks.getUpgradeLevel() < barracksUpgradeMax) {
            if(this._mathState.getTotalGold() > this.scene.barracks.getUpgradeCostGold() && this._mathState.getTotalFarmers() > this.scene.barracks.getUpgradeCostFarmers()) {
                return true;
            } else {
                return false;
            }
        }
    }

    //thievesGuild
    private _thievesGuildUpgradeAllow() {
        if(this.scene.thievesGuild.getUpgradeLevel() < thievesGuildUpgradeMax) {
            if(this._mathState.getTotalGold() > this.scene.thievesGuild.getUpgradeCostGold() && this._mathState.getTotalFarmers() > this.scene.thievesGuild.getUpgradeCostFarmers()) {
                return true;
            } else {
                return false;
            }
        }
    }    

    //workShop
    private _workShopUpgradeAllow() {
        if(this.scene.workShop.getUpgradeLevel() < workShopUpgradeMax) {
            if(this._mathState.getTotalGold() > this.scene.workShop.getUpgradeCostGold() && this._mathState.getTotalFarmers() > this.scene.workShop.getUpgradeCostFarmers()) {
                return true;
            } else {
                return false;
            }
        }
    }


    //tower
    private _towerUpgradeAllow() {
        if(this.scene.tower.getUpgradeLevel() < towerUpgradeMax) {
            if(this._mathState.getTotalGold() > this.scene.tower.getUpgradeCostGold() && this._mathState.getTotalFarmers() > this.scene.tower.getUpgradeCostFarmers()) {
                return true;
            } else {
                return false;
            }
        }
    }


    //tavern
    private _tavernUpgradeAllow() {
        if(this.scene.tavern.getUpgradeLevel() < tavernUpgradeMax) {
            if(this._mathState.getTotalGold() > this.scene.tavern.getUpgradeCostGold() && this._mathState.getTotalFarmers() > this.scene.tavern.getUpgradeCostFarmers()) {
                return true;
            } else {
                return false;
            }
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

}