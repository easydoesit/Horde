import { AdvancedDynamicTexture,  Button, Rectangle, Control, TextBlock} from "@babylonjs/gui";
import { castleToFarmPaths, DEBUGMODE, GUIFONT1, modelsDir } from "../utils/CONSTANTS";
import { PlayMode } from "../scenes/playmode";
import { wheatUpgradesMax, wheatUpgradeValue, farmCost, farmUpgradeMax, mineUpgradeMax, oreUpgradeValue, weaponUpgradeValue, smithyUpgradeMax, farmersMaxPerFarm, villagesUpgradeValue, barracksUpgradeMax, lootUpgradeValue, thievesGuildUpgradeMax } from "../utils/MATHCONSTANTS";
import { UpgradeSection } from "./upgradeSection";
import { UpgradeWindow } from "./upgradeWindows";
import { InSceneStuctureGUI } from "./inSceneStructureGUI";
import { GameStateObserverI, GameStateI, MathStateObserverI, MathStateI, StructureI, GUIProductCounterI } from "../../typings";
import { App } from "../app";
import { StartScreen } from "../scenes/start_screen";
import { AddStructureButton } from "./addStructureButton";
import { Runner } from "../models_characters/runners";
import { ProductCounter } from "./productCounter";

export class GUIPlay implements GameStateObserverI, MathStateObserverI {
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

    //Bottom
    private _playGUIWrapperBottom:Rectangle;
    private _clickerBtn:Button;
    
    //castle
    public GUIWrapperCastleUpgrade:Rectangle;
    private _addMineButton:AddStructureButton;
    private _addSmithyButton:AddStructureButton;
    private _addBarracksButton:AddStructureButton;
    private _addThievesGuildButton:AddStructureButton;
 
    //farms
    public GUIWrapperFarmUpgrade:Rectangle;
    public farmersMaxTextBox:TextBlock;
    private _wheatUpgrade:UpgradeSection;
    private _farmUpgrade01Section:UpgradeSection;
    private _farmUpgrade02Section:UpgradeSection;
    private _farmUpgrade03Section:UpgradeSection;
    private _farmUpgrade04Section:UpgradeSection;
    private _farmUpgradeSections:UpgradeSection[];
    private _addFarmButton02:AddStructureButton;
    private _addFarmButton03:AddStructureButton;
    private _addFarmButton04:AddStructureButton;
    private _addFarmButtons:AddStructureButton[];

    //mine
    public wrapperMineUpgrade:Rectangle;
    private _mineUpgradeSection:UpgradeSection;
    public mineInSceneGUI:Rectangle;

    //smithy
    public wrapperSmithyUpgrade:Rectangle;
    private _smithyUpgradeSection:UpgradeSection;
    public smithyInSceneGUI:Rectangle;

    //barracks
    public wrapperBarracksUpgrade:Rectangle;
    private _barracksUpgradeSection:UpgradeSection;
    public barracksInSceneGUI:Rectangle;

    //thievesGuild
    public wrapperThievesGuildUpgrade:Rectangle;
    private _thievesGuildUpgradeSection:UpgradeSection;
    public thievesGuildInSceneGUI:Rectangle;

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
        
        //TOP
        //playGUITop
        this._wrapperTop = new Rectangle('playGUIWrapperTop');
        this._wrapperTop.width = 0.8;
        this._wrapperTop.height= 0.12;
        this._wrapperTop.thickness = 1;
        this._wrapperTop.top = -400;
        this.gameGUI.addControl(this._wrapperTop);

        //FARMERS
        this._farmersCount = new ProductCounter('Farmers', 0, 0, `${this._mathState.totalFarmers}`, this._wrapperTop);
        this._goldPerSecondCount = new ProductCounter('Gold/Second', 24, 0, `${this._mathState.goldPerSecond}`, this._wrapperTop);
        this._goldCount = new ProductCounter('Gold', 48, 0, `${this._mathState.totalGold}`, this._wrapperTop);
        this._lumenCount = new ProductCounter('Lumens', 0, -300, `${this._mathState.totalLumens}`, this._wrapperTop);
        this._oreCount = new ProductCounter('Ore', 0, 300, `${this._mathState.totalOre}`, this._wrapperTop);
        this._weaponCount = new ProductCounter('Weapons', 24, 300,`${this._mathState.totalWeapons}`, this._wrapperTop);
        this._villageCount = new ProductCounter('Villages', 48, 300, `${this._mathState.totalVillages}`, this._wrapperTop);
        this._lootCount = new ProductCounter('Loot', 72, 300, `${this._mathState.totalLoot}`, this._wrapperTop);

        //Bottom
        //playGUIBottom
        this._playGUIWrapperBottom = new Rectangle('playGUIWrapperBottom');
        this._playGUIWrapperBottom.width = 0.8;
        this._playGUIWrapperBottom.height= 0.1;
        this._playGUIWrapperBottom.thickness = 1;
        this._playGUIWrapperBottom.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.gameGUI.addControl(this._playGUIWrapperBottom);


        //main clicker button
        this._clickerBtn = Button.CreateSimpleButton("addFarmer", "Add Farmer");
        this._clickerBtn.fontFamily = GUIFONT1;
        this._clickerBtn.width = 0.2
        this._clickerBtn.height = "40px";
        this._clickerBtn.color = "white";
        this._clickerBtn.thickness = 2;
        this._clickerBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        
        this._playGUIWrapperBottom.addControl(this._clickerBtn);

        this._clickerBtn.onPointerDownObservable.add(() => {
            
            this._clickFunction();
        
        });

        
        //Farm Upgrades
        //this is the GUI that Appears when you click on the Farm to upgrade
        this.GUIWrapperFarmUpgrade = new UpgradeWindow('FarmUpgradeWindow' , 'brown', this);

        this.farmersMaxTextBox = new TextBlock('MaxFarmers', `Max Famers: ${this._mathState.farmersMax}`);
        this.farmersMaxTextBox.fontFamily = GUIFONT1;
        this.farmersMaxTextBox.top = -430;
        this.farmersMaxTextBox.width = .3;
        this.farmersMaxTextBox.color= 'white';
        this.GUIWrapperFarmUpgrade.addControl(this.farmersMaxTextBox);

        //this creates the wheat Upgrade section on the Farm Window
        this._wheatUpgrade = new UpgradeSection('wheatUpgrade', `adds %${wheatUpgradeValue * 100} gold/second`, this._mathState.costOfWheatUpgrade, null, wheatUpgradesMax, this.GUIWrapperFarmUpgrade, -320, this.scene, () => this.wheatUpgradeCallback());

        //this creates the farm Upgrade section on the GUI
        this._farmUpgrade01Section = new UpgradeSection('Farm 01 Upgrades', `next Uprade allows ${this._checkUpgradeFarmersMax(this.scene.farm01)} farmers on this farm`, this.scene.farm01.upgradeCostGold, null, farmUpgradeMax, this.GUIWrapperFarmUpgrade, -200, this.scene, () => this._farmUpgradeCallBack(this.scene.farm01));
        
        this._farmUpgrade02Section = new UpgradeSection('Farm 02 Upgrades', `next Uprade allows ${this._checkUpgradeFarmersMax(this.scene.farm02)} farmers on this farm`, this.scene.farm02.upgradeCostGold, null, farmUpgradeMax, this.GUIWrapperFarmUpgrade, -80, this.scene, () => this._farmUpgradeCallBack(this.scene.farm02));
        this._farmUpgrade02Section.wrapperUpgradeContainer.isVisible = false;
        
        this._farmUpgrade03Section = new UpgradeSection('Farm 03 Upgrades', `next Uprade allows ${this._checkUpgradeFarmersMax(this.scene.farm03)} farmers on this farm`, this.scene.farm03.upgradeCostGold, null, farmUpgradeMax, this.GUIWrapperFarmUpgrade, 40, this.scene, () => this._farmUpgradeCallBack(this.scene.farm03));
        this._farmUpgrade03Section.wrapperUpgradeContainer.isVisible = false;

        this._farmUpgrade04Section = new UpgradeSection('Farm 04 Upgrades', `next Uprade allows  ${this._checkUpgradeFarmersMax(this.scene.farm04)} farmers on this farm`, this.scene.farm04.upgradeCostGold, null, farmUpgradeMax, this.GUIWrapperFarmUpgrade, 160, this.scene, () => this._farmUpgradeCallBack(this.scene.farm04));
        this._farmUpgrade04Section.wrapperUpgradeContainer.isVisible = false;
        this._farmUpgradeSections.push(this._farmUpgrade01Section, this._farmUpgrade02Section, this._farmUpgrade03Section, this._farmUpgrade04Section);
        
        //ADDFarm Buttons.
        this._addFarmButtons =[];

        this._addFarmButton02 = new AddStructureButton('addFarm02Button', this, this._farmUpgrade02Section,this.GUIWrapperFarmUpgrade as UpgradeWindow, -80, this.scene.farm02, () => this._farmAdditionCallback(this.GUIWrapperFarmUpgrade, 'addFarm03Button', this._farmUpgrade02Section, this.scene.farm02));
        this.GUIWrapperFarmUpgrade.addControl(this._addFarmButton02);

        this._addFarmButton03 = new AddStructureButton('addFarm03Button', this, this._farmUpgrade03Section,this.GUIWrapperFarmUpgrade as UpgradeWindow, 40, this.scene.farm03, () => this._farmAdditionCallback(this.GUIWrapperFarmUpgrade, 'addFarm04Button', this._farmUpgrade03Section, this.scene.farm03));
        this._addFarmButton03.isEnabled = false;
        this._addFarmButton03.isVisible = false;
        this.GUIWrapperFarmUpgrade.addControl(this._addFarmButton03);

        this._addFarmButton04 = new AddStructureButton('addFarm04Button', this, this._farmUpgrade04Section,this.GUIWrapperFarmUpgrade as UpgradeWindow, 160, this.scene.farm04, () => this._farmAdditionCallback(this.GUIWrapperFarmUpgrade, null, this._farmUpgrade04Section, this.scene.farm04));
        this._addFarmButton04.isEnabled = false;
        this._addFarmButton04.isVisible = false;
        this.GUIWrapperFarmUpgrade.addControl(this._addFarmButton04);

        this._addFarmButtons.push(this._addFarmButton02, this._addFarmButton03, this._addFarmButton04);

        //Mine Upgrades
        //this is the GUI that Appears when you click on the Mine to upgrade
        this.wrapperMineUpgrade = new UpgradeWindow('mineUpgradeWindow', 'DarkSlateGray', this);
        const oreValue = oreUpgradeValue * 100;
        
        this._mineUpgradeSection = new UpgradeSection('MineUpgradeSection', `Speeds Up Ore Production by ${oreValue}%`, this.scene.mine.upgradeCostGold, ['farmers', this.scene.mine.upgradeCostFarmers], mineUpgradeMax, this.wrapperMineUpgrade, -320, this.scene, () => {this._mineUpgradeCallback()});

        this.mineInSceneGUI = new InSceneStuctureGUI('MineSceneGui', this, this.scene.mine, 'Ore');
        
        //Smithy Upgrades
        //this is the GUI that Appears when you click on the Smithy Building to upgrade
        this.wrapperSmithyUpgrade = new UpgradeWindow('SmithyUpgradeWindow', 'skyblue', this);
        const weaponValue = weaponUpgradeValue * 100;
        
        this._smithyUpgradeSection = new UpgradeSection('SmithyUpgradeSection', `Speeds Up Weapon Production by ${weaponValue}%`, this.scene.smithy.upgradeCostGold, ['farmers', this.scene.smithy.upgradeCostFarmers], smithyUpgradeMax, this.wrapperSmithyUpgrade, -320, this.scene, () => {this._smithyUpgradeCallback()});
        
        this.smithyInSceneGUI = new InSceneStuctureGUI('SmithySceneGui', this, this.scene.smithy, 'Weapons')

        //Barracks Upgrades
        //this is the GUI that Appears when you click on the Barracks Building to upgrade
        this.wrapperBarracksUpgrade = new UpgradeWindow('BarracksUpgradeWindow', 'black', this);
        const villageValue = villagesUpgradeValue * 100;
        
        this._barracksUpgradeSection = new UpgradeSection('BarrackUpgradeSection', `Speeds Up Village Capture by ${villageValue}%`, this.scene.barracks.upgradeCostGold, ['farmers', this.scene.barracks.upgradeCostFarmers], barracksUpgradeMax, this.wrapperBarracksUpgrade, -320, this.scene, () => {this._barracksUpgradeCallback()});
        
        this.barracksInSceneGUI = new InSceneStuctureGUI('BarracksSceneGui', this, this.scene.barracks, 'Villages');
        
        //ThievesGuild Upgrades
        //this is the GUI that Appears whn you click on the Smithy Building to upgrade
        this.wrapperThievesGuildUpgrade = new UpgradeWindow('ThievesGuildUpgradeWindow', 'orange', this);
        const LootValue = lootUpgradeValue * 100;
        
        this._thievesGuildUpgradeSection = new UpgradeSection('ThievesGuildUpgradeSection', `Speeds Up Loot Capture by ${LootValue}%`, this.scene.thievesGuild.upgradeCostGold, ['farmers', this.scene.thievesGuild.upgradeCostFarmers], thievesGuildUpgradeMax, this.wrapperThievesGuildUpgrade, -320, this.scene, () => {this._thievesGuildUpgradeCallback()});
        
        this.thievesGuildInSceneGUI = new InSceneStuctureGUI('ThievesGuildSceneGui', this, this.scene.thievesGuild, 'Loot');


        //Castle Upgrades
        //this is the GUI that Appears when you click on the Castle to upgrade
        this.GUIWrapperCastleUpgrade = new UpgradeWindow('castleUpgradeWindow', 'gray', this);

        this._addMineButton = new AddStructureButton('addMineButton', this, this._mineUpgradeSection,this.GUIWrapperCastleUpgrade as UpgradeWindow, -320, this.scene.mine, () => {this._mineAdditionCallback()});
        this.GUIWrapperCastleUpgrade.addControl(this._addMineButton);
        this._addMineButton.isEnabled = false;

        this._addSmithyButton = new AddStructureButton('addSmithyButton', this, this._smithyUpgradeSection, this.GUIWrapperCastleUpgrade as UpgradeWindow, -200, this.scene.smithy, () => {this._smithyAdditionCallback()});
        this.GUIWrapperCastleUpgrade.addControl(this._addSmithyButton);
        this._addSmithyButton.isEnabled = false;

        this._addBarracksButton = new AddStructureButton('addBarracksButton', this, this._barracksUpgradeSection, this.GUIWrapperCastleUpgrade as UpgradeWindow, -80, this.scene.barracks, () => {this._barracksAdditionCallback()});
        this.GUIWrapperCastleUpgrade.addControl(this._addBarracksButton);
        this._addBarracksButton.isEnabled = false;

        this._addThievesGuildButton = new AddStructureButton('addThievesGuildButton', this, this._thievesGuildUpgradeSection, this.GUIWrapperCastleUpgrade as UpgradeWindow,  40, this.scene.thievesGuild, () => {this._thievesGuildAdditionCallback()});
        this.GUIWrapperCastleUpgrade.addControl(this._addThievesGuildButton);
        this._addBarracksButton.isEnabled = false;


        //GAMELOOP//
        this.scene.onBeforeRenderObservable.add(() => {
            
            //wheat
            this._wheatUpgrade.upgradeAble = this._wheatUpgradeAllowed();

            //farms
            for (let i in this._farmUpgradeSections) {
                this._farmUpgradeSections[i].upgradeAble = this._farmUpgradeAllowed(this.scene.farms[i]);
            }
            
            for (let i in this._addFarmButtons) {
                if(this._addFarmButtons[i].isVisible && this._mathState.totalGold > farmCost) {
                    this._addFarmButtons[i].isEnabled = true;
                } else if (this._addFarmButtons[i].isVisible && this._mathState.totalGold < farmCost) {
                    this._addFarmButtons[i].isEnabled = false;
                }
            }

            //mine
            if (this._addMineButton.isVisible) {
                this._addMineButton.isEnabled = this._mineUpgradeAllow();
            }
           
            this._mineUpgradeSection.upgradeAble = this._mineUpgradeAllow();
            
            //smithy
            if (this._addSmithyButton.isVisible) {
                this._addSmithyButton.isEnabled = this._smithyUpgradeAllow();
            }
            this._smithyUpgradeSection.upgradeAble = this._smithyUpgradeAllow();

            //barracks
            if (this._addBarracksButton.isVisible) {
                this._addBarracksButton.isEnabled = this._barracksUpgradeAllow();
            }
            this._barracksUpgradeSection.upgradeAble = this._barracksUpgradeAllow();

             //barracks
             if (this._addThievesGuildButton.isVisible) {
                this._addThievesGuildButton.isEnabled = this._thievesGuildUpgradeAllow();
            }
            this._thievesGuildUpgradeSection.upgradeAble = this._thievesGuildUpgradeAllow();

        });

    }

    private _clickFunction(){
        if (DEBUGMODE) {
            console.log('Add Farmer Button Clicked');
        }
            
        //make a farmer
        this._makeFarmer();  
    }

    //this is the observer function to the MathState Class
    public updateMathState(mathState: MathStateI): void {
        
        //Everytime the MathState Class runs the game loop these update.
        this._farmersCount.changeText(`${mathState.totalFarmers}`);
        this._goldPerSecondCount.changeText(`${mathState.goldPerSecond}`);
        this._goldCount.changeText(`${mathState.totalGold}`);
        this._lumenCount.changeText(`${this._mathState.totalLumens}`);
        this._oreCount.changeText(`${this._mathState.totalOre}`);
        this._weaponCount.changeText(`${this._mathState.totalWeapons}`);
        this._villageCount.changeText(`${this._mathState.totalVillages}`);
        
    }

    //wheat
    private _wheatUpgradeAllowed() {
        if (this._mathState.totalGold > this._mathState.costOfWheatUpgrade) {
            return true;
        } else {
            return false;
        }
    }

     //Wheat
     public wheatUpgradeCallback() {
    
        if (this._mathState.wheatValue < wheatUpgradeValue * wheatUpgradesMax) {
            if (this._mathState.totalGold > this._mathState.costOfWheatUpgrade) {
            
            //apply the value changes
            this._mathState.changeWheatValue();
            this._mathState.changeGoldPerSecond();

            //use gold
            this._mathState.spendGold(this._mathState.costOfWheatUpgrade);
            
            //apply cost change
            this._mathState.upgradeWheat();
            this._mathState.changeCostOfWheatUpgrade();

            this._wheatUpgrade.goldCost = this._mathState.costOfWheatUpgrade;

            }

        }
        
    }
    
    //farms
    private _farmUpgradeAllowed(farm:StructureI) {
        //this depends on whether the farm is completely upgraded or not.
        if (farm.upgradeLevel < farmUpgradeMax) {
            if (this._mathState.totalGold > farm.upgradeCostGold) {
                return true;
            } else {
                return false;
            }
        }
    }

    private _checkUpgradeFarmersMax(farm:StructureI) {
        let total = null;

        if (farm.upgradeLevel < farmUpgradeMax) {
            total = Math.round(farmersMaxPerFarm(farm.upgradeLevel + 1))
        } else {
            total = "Maxed out!";
        }

        return total;
    }

    private _farmAdditionCallback(wrapper:Rectangle, nextButton:string | null, upgradeSection:UpgradeSection, farm:StructureI) {
        //show the section in the GUI
        upgradeSection.wrapperUpgradeContainer.isVisible = true;

        //make the next add Farm Button Available
        if(nextButton !== null) {
            const searchedButton = wrapper.getChildByName(nextButton) as Button;
            searchedButton.isVisible = true;
        }

        //update the GUI
        for (let i in this._farmUpgradeSections) {
            this._farmUpgradeSections[i].instruction = `next Upgrade allows ${this._checkUpgradeFarmersMax(this.scene.farms[i])} farmers on this farm`
            this._farmUpgradeSections[i].textBlockUpgradeInstruction.text = this._farmUpgradeSections[i].instruction;
        }

        this.farmersMaxTextBox.text = `Max Farmers: ${this._mathState.farmersMax}`;

    }

    private _farmUpgradeCallBack(farm:StructureI) {

        farm.upgradeState();

        for(let i in this._farmUpgradeSections) {
            this._farmUpgradeSections[i].goldCost = this.scene.farms[i].upgradeCostGold;
        }

        this.farmersMaxTextBox.text = `Max Farmers: ${this._mathState.farmersMax}`;

    }
    
    //mine
    private _mineUpgradeAllow() {
        if(this.scene.mine.upgradeLevel < mineUpgradeMax) {
            if(this._mathState.totalGold > this.scene.mine.upgradeCostGold && this._mathState.totalFarmers > this.scene.mine.upgradeCostFarmers) {
                return true;
            } else {
                return false;
            }
        }
    }

    //mine Callbacks

    private _mineAdditionCallback() {
        if (DEBUGMODE) {
            console.log('addMineCalled');
        }
        
    }

    private _mineUpgradeCallback() {
        if (DEBUGMODE) {
            console.log('mineUpgradeChangeCalled');
        }
        
        //upgrade the State
        this.scene.mine.upgradeState();

        this._mineUpgradeSection.goldCost = this.scene.mine.upgradeCostGold;
        this._mineUpgradeSection.otherCost[1] = this.scene.mine.upgradeCostFarmers;

    }

    //smithy
    private _smithyUpgradeAllow() {
        if(this.scene.smithy.upgradeLevel < smithyUpgradeMax) {
            if(this._mathState.totalGold > this.scene.smithy.upgradeCostGold && this._mathState.totalFarmers > this.scene.smithy.upgradeCostFarmers) {
                return true;
            } else {
                return false;
            }
        }
    }

    //smithy Callbacks

    private _smithyAdditionCallback() {
        if (DEBUGMODE) {
            console.log('addSmithyCalled');
        }     
    }

    private _smithyUpgradeCallback() {
        if (DEBUGMODE) {
            console.log('smithyUpgradeChangeCalled');
        }
        
        //upgrade the State
        this.scene.smithy.upgradeState();

        this._smithyUpgradeSection.goldCost = this.scene.smithy.upgradeCostGold;
        this._smithyUpgradeSection.otherCost[1] = this.scene.smithy.upgradeCostFarmers;

    }

    //barracks
    private _barracksUpgradeAllow() {
        if(this.scene.barracks.upgradeLevel < barracksUpgradeMax) {
            if(this._mathState.totalGold > this.scene.barracks.upgradeCostGold && this._mathState.totalFarmers > this.scene.barracks.upgradeCostFarmers) {
                return true;
            } else {
                return false;
            }
        }
    }

    //barracks Callbacks

    private _barracksAdditionCallback() {
        if (DEBUGMODE) {
            console.log('addBarracksCalled');
        }     
    }

    private _barracksUpgradeCallback() {
        if (DEBUGMODE) {
            console.log('barracksUpgradeChangeCalled');
        }
        
        //upgrade the State
        this.scene.barracks.upgradeState();

        this._barracksUpgradeSection.goldCost = this.scene.barracks.upgradeCostGold;
        this._barracksUpgradeSection.otherCost[1] = this.scene.barracks.upgradeCostFarmers;

    }

     //thievesGuild
     private _thievesGuildUpgradeAllow() {
        if(this.scene.thievesGuild.upgradeLevel < thievesGuildUpgradeMax) {
            if(this._mathState.totalGold > this.scene.thievesGuild.upgradeCostGold && this._mathState.totalFarmers > this.scene.thievesGuild.upgradeCostFarmers) {
                return true;
            } else {
                return false;
            }
        }
    }

    //barracks Callbacks

    private _thievesGuildAdditionCallback() {
        if (DEBUGMODE) {
            console.log('addthievesGuildCalled');
        }     
    }

    private _thievesGuildUpgradeCallback() {
        if (DEBUGMODE) {
            console.log('thievesGuildUpgradeChangeCalled');
        }
        
        //upgrade the State
        this.scene.thievesGuild.upgradeState();

        this._thievesGuildUpgradeSection.goldCost = this.scene.thievesGuild.upgradeCostGold;
        this._thievesGuildUpgradeSection.otherCost[1] = this.scene.thievesGuild.upgradeCostFarmers;

    }

    //GUI functions
    public showUpgrades(wrapper:Rectangle) {
        
        if (!wrapper.isVisible) {
            
            wrapper.isVisible = true;
        
        }
    }
    
    //Game interaction functions
    private _makeFarmer() {
        let currentCount = this._mathState.totalFarmers + this._mathState.runningFarmers;

        if(this._mathState.totalFarmers + this._mathState.runningFarmers < this._mathState.farmersMax) {
            //make a farmer and change the count
            new Runner('farmer', currentCount, modelsDir, 'farmer.glb', this.scene, 0, castleToFarmPaths, () => {this.scene.mathState.addFarmers(1); this._mathState.endFarmerRun()});
            this._mathState.makeFarmerRun(1);
        
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

}