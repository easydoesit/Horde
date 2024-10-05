import { AdvancedDynamicTexture,  Button, Rectangle, Control, TextBlock} from "@babylonjs/gui";
import { DEBUGMODE, GUIFONT1 } from "../utils/CONSTANTS";
import { Farmer } from "../models_characters/farmer";
import { PlayMode } from "../scenes/playmode";
import { wheatUpgradesMax, wheatUpgradeValue, farmCost, farmUpgradeMax, mineUpgradeMax, oreUpgradeValue, weaponUpgradeValue, smithyUpgradeMax, farmersMaxPerFarm } from "../utils/MATHCONSTANTS";
import { UpgradeSection } from "./upgradeSection";
import { UpgradeWindow } from "./upgradeWindows";
import { InSceneStuctureGUI } from "./inSceneStructureGUI";
import { GameStateObserverI, GameStateI, MathStateObserverI, MathStateI, StructureObserverI, StructureI } from "../../typings";
import { App } from "../app";
import { StartScreen } from "../scenes/start_screen";
import { AddStructureButton } from "./addStructureButton";

export class GUIPlay implements GameStateObserverI, MathStateObserverI {
    private _app:App;
    private _gameState:GameStateI;
    private _mathState:MathStateI;
    public name:string;
    public scene:PlayMode;
 
    //GUI
    public gameGUI:AdvancedDynamicTexture;
    
    //Top
    private _playGUIWrapperTop:Rectangle;
    
    private _textBlockFarmer:TextBlock;
    private _textBlockTotalFarmers:TextBlock;
    
    private _textBlockGoldPerSecond:TextBlock;
    private _totalGoldPerSecondTextBlock:TextBlock;
   
    private _textBlockGold:TextBlock
    private _totalGoldTextBlock:TextBlock;

    private _textBlockLumens:TextBlock;
    private _textBlockTotalLumens:TextBlock
    
    private _textBlockOre:TextBlock;
    private _textBlockTotalOre:TextBlock

    private _textBlockWeapons:TextBlock;
    private _textBlockTotalWeapons:TextBlock;

    //Bottom
    private _playGUIWrapperBottom:Rectangle;
    private _clickerBtn:Button;
    
    //castle
    public GUIWrapperCastleUpgrade:Rectangle;
    private _addMineButton:AddStructureButton;
    private _addSmithyButton:AddStructureButton;
 
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
        this._playGUIWrapperTop = new Rectangle('playGUIWrapperTop');
        this._playGUIWrapperTop.width = 0.8;
        this._playGUIWrapperTop.height= 0.1;
        this._playGUIWrapperTop.thickness = 1;
        this._playGUIWrapperTop.top = -400;
        this.gameGUI.addControl(this._playGUIWrapperTop);

        //FARMERS
        this._textBlockTotalFarmers = new TextBlock('FarmerCount', `${this._mathState.totalFarmers}`);
        this._textBlockTotalFarmers.fontFamily = GUIFONT1;
        this._textBlockTotalFarmers.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this._textBlockTotalFarmers.top = -30;
        this._textBlockTotalFarmers.left= 670;
        this._textBlockTotalFarmers.color = 'white';
        this._playGUIWrapperTop.addControl(this._textBlockTotalFarmers);

        this._textBlockFarmer = new TextBlock('farmer', 'farmers');
        this._textBlockFarmer.fontFamily = GUIFONT1;
        this._textBlockFarmer.top = -30;
        this._textBlockFarmer.left= 35;
        this._textBlockFarmer.color = 'white';
        this._playGUIWrapperTop.addControl(this._textBlockFarmer);
        
        //GOLD
        this._totalGoldPerSecondTextBlock = new TextBlock('TotalGoldPerSecond', `${this._mathState.goldPerSecond}`);
        this._totalGoldPerSecondTextBlock.fontFamily =GUIFONT1;
        this._totalGoldPerSecondTextBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this._totalGoldPerSecondTextBlock.top = -10;
        this._totalGoldPerSecondTextBlock.left= 670;
        this._totalGoldPerSecondTextBlock.color = "white";
        this._playGUIWrapperTop.addControl(this._totalGoldPerSecondTextBlock);

        this._textBlockGoldPerSecond = new TextBlock('GoldPerSecond', 'gold / second')
        this._textBlockGoldPerSecond.fontFamily = GUIFONT1;
        this._textBlockGoldPerSecond.top = -10;
        this._textBlockGoldPerSecond.left= 53;
        this._textBlockGoldPerSecond.color = 'white';
        this._playGUIWrapperTop.addControl(this._textBlockGoldPerSecond);    
        
        this._totalGoldTextBlock = new TextBlock('TotalGold', `${this._mathState.totalGold}`);
        this._totalGoldTextBlock.fontFamily = GUIFONT1;
        this._totalGoldTextBlock.top = 10;
        this._totalGoldTextBlock.left= 670;
        this._totalGoldTextBlock.color = 'white';
        this._totalGoldTextBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this._playGUIWrapperTop.addControl(this._totalGoldTextBlock);

        this._textBlockGold = new TextBlock('gold', 'gold');
        this._textBlockGold.fontFamily = GUIFONT1;
        this._textBlockGold.top = 10;
        this._textBlockGold.left= 16;
        this._textBlockGold.color = 'white';
        this._playGUIWrapperTop.addControl(this._textBlockGold);
        
        //LUMENS
        this._textBlockTotalLumens = new TextBlock('TotalLumens', `${this._mathState.totalLumens}`);
        this._textBlockTotalLumens.fontFamily = GUIFONT1;
        this._textBlockTotalLumens.top = -30;
        this._textBlockTotalLumens.left= 0;
        this._textBlockTotalLumens.color = 'white';
        this._textBlockTotalLumens.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this._playGUIWrapperTop.addControl(this._textBlockTotalLumens);

        this._textBlockLumens = new TextBlock('ore', 'lumens');
        this._textBlockLumens.fontFamily = GUIFONT1;
        this._textBlockLumens.top = -30;
        this._textBlockLumens.left= 50;
        this._textBlockLumens.color = 'white';
        this._textBlockLumens.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this._playGUIWrapperTop.addControl(this._textBlockLumens);

        //ORE
        this._textBlockTotalOre = new TextBlock('TotalOre', `${this._mathState.totalOre}`);
        this._textBlockTotalOre.fontFamily = GUIFONT1;
        this._textBlockTotalOre.top = -30;
        this._textBlockTotalOre.left= 940;
        this._textBlockTotalOre.color = 'white';
        this._textBlockTotalOre.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this._playGUIWrapperTop.addControl(this._textBlockTotalOre);

        this._textBlockOre = new TextBlock('ore', 'ore');
        this._textBlockOre.fontFamily = GUIFONT1;
        this._textBlockOre.top = -30;
        this._textBlockOre.left= 216;
        this._textBlockOre.color = 'white';
        this._playGUIWrapperTop.addControl(this._textBlockOre);

        //Weapons
        this._textBlockTotalWeapons = new TextBlock('TotalWeapons', `${this._mathState.totalWeapons}`);
        this._textBlockTotalWeapons.fontFamily = GUIFONT1;
        this._textBlockTotalWeapons.top = -10;
        this._textBlockTotalWeapons.left= 940;
        this._textBlockTotalWeapons.color = 'white';
        this._textBlockTotalWeapons.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this._playGUIWrapperTop.addControl(this._textBlockTotalWeapons);

        this._textBlockWeapons = new TextBlock('Weapons', 'Weapons');
        this._textBlockWeapons.fontFamily = GUIFONT1;
        this._textBlockWeapons.top = -10;
        this._textBlockWeapons.left= 216;
        this._textBlockWeapons.color = 'white';
        this._playGUIWrapperTop.addControl(this._textBlockWeapons);

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
        //this is the GUI that Appears whn you click on the Mine to upgrade
        this.wrapperMineUpgrade = new UpgradeWindow('mineUpgradeWindow', 'DarkSlateGray', this);
        const oreValue = oreUpgradeValue * 100;
        
        this._mineUpgradeSection = new UpgradeSection('MineUpgradeSection', `Speeds Up Ore Production by ${oreValue}%`, this.scene.mine.upgradeCostGold, ['farmers', this.scene.mine.upgradeCostFarmers], mineUpgradeMax, this.wrapperMineUpgrade, -320, this.scene, () => {this._mineUpgradeCallback()});

        this.mineInSceneGUI = new InSceneStuctureGUI('MineSceneGui', this, this.scene.mine, 'Ore');
        this.mineInSceneGUI.zIndex = -100;
        
        //Smithy Upgrades
        //this is the GUI that Appears whn you click on the Smithy Building to upgrade
        this.wrapperSmithyUpgrade = new UpgradeWindow('SmithyUpgradeWindow', 'skyblue', this);
        const weaponValue = weaponUpgradeValue * 100;
        
        this._smithyUpgradeSection = new UpgradeSection('SmithyUpgradeSection', `Speeds Up Weapon Production by ${weaponValue}%`, this.scene.smithy.upgradeCostGold, ['farmers', this.scene.smithy.upgradeCostFarmers], smithyUpgradeMax, this.wrapperSmithyUpgrade, -320, this.scene, null);
        
        this.smithyInSceneGUI = new InSceneStuctureGUI('SmithySceneGui', this, this.scene.smithy, 'Weapons')
        this.smithyInSceneGUI.zIndex = -100;
        
        //Castle Upgrades
        //this is the GUI that Appears when you click on the Castle to upgrade
        this.GUIWrapperCastleUpgrade = new UpgradeWindow('castleUpgradeWindow', 'gray', this);

        this._addMineButton = new AddStructureButton('addMineButton', this, this._mineUpgradeSection,this.GUIWrapperCastleUpgrade as UpgradeWindow, -320, this.scene.mine, () => {this._mineAdditionCallback()});
        this.GUIWrapperCastleUpgrade.addControl(this._addMineButton);
        this._addMineButton.isEnabled = false;

        this._addSmithyButton = new AddStructureButton('addSmithyButton', this, this._smithyUpgradeSection, this.GUIWrapperCastleUpgrade as UpgradeWindow, 0, this.scene.smithy, null)
        this.GUIWrapperCastleUpgrade.addControl(this._addSmithyButton);
        this._addSmithyButton.isEnabled = false;

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
            
            //weapons
            if (this._addSmithyButton.isVisible) {
                this._addSmithyButton.isEnabled = this._smithyUpgradeAllow();
            }
            this._smithyUpgradeSection.upgradeAble = this._smithyUpgradeAllow();


        });

    }

    private _clickFunction(){
            console.log('Add Farmer Button Clicked');
            //make a farmer and change the count
            this._makeFarmer(this._mathState.totalFarmers);  
    }

    //this is the observer function to the MathState Class
    public updateMathState(mathState: MathStateI): void {
        
        //Everytime the MathState Class runs the game loop these update.
        this._textBlockTotalFarmers.text = `${mathState.totalFarmers}`;
        this._totalGoldPerSecondTextBlock.text = `${mathState.goldPerSecond}`;
        this._totalGoldTextBlock.text = `${mathState.totalGold}`;
        this.farmersMaxTextBox.text = `Max Farmers: ${this._mathState.farmersMax}`;
        this._textBlockTotalOre.text = `${this._mathState.totalOre}`;
        this._textBlockTotalLumens.text = `${this._mathState.totalLumens}`;
        this._textBlockTotalWeapons.text = `${this._mathState.totalWeapons}`;
        this._mineUpgradeSection.goldCost = this.scene.mine.upgradeCostGold;
        this._mineUpgradeSection.otherCost[1] = this.scene.mine.upgradeCostFarmers;  

        
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
        console.log(`check upgradeNext for ${farm.name}`);
        if (farm.upgradeLevel < farmUpgradeMax) {
            total = Math.round(farmersMaxPerFarm(farm.upgradeLevel + 1))
        } else {
            total = "Maxed out!";
        }
        console.log(`${farm.name} next upgrade is: ${total}`);
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

    }

    private _farmUpgradeCallBack(farm:StructureI) {

        farm.upgradeState();

        for(let i in this._farmUpgradeSections) {
            this._farmUpgradeSections[i].goldCost = this.scene.farms[i].upgradeCostGold;
        }

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

    }

    private _smithyUpgradeAllow() {
        if(this.scene.smithy.upgradeLevel < smithyUpgradeMax) {
            if(this._mathState.totalGold > this.scene.smithy.upgradeCostGold && this._mathState.totalFarmers > this.scene.smithy.upgradeCostFarmers) {
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
    private _makeFarmer(currentCount:number) {

        if(this._mathState.totalFarmers + this._mathState.runningFarmers < this._mathState.farmersMax) {
            //make a farmer and change the count
            new Farmer(currentCount.toLocaleString(), this.scene);
            this._mathState.makeFarmerRun(1);
        }  
    }


    public updateGameState(gamestate: GameStateI): void {
        
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