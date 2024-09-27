import { AdvancedDynamicTexture,  Button, Rectangle, Control, TextBlock} from "@babylonjs/gui";
import { GUIFONT1 } from "../utils/CONSTANTS";
import { Farmer } from "../models_characters/farmer";
import { PlayMode } from "../scenes/playmode";
import { wheatUpgradesMax, wheatUpgradeValue, farmCost, farmUpgradeMax, mineUpgradeMax, oreUpgradeValue } from "../utils/MATHCONSTANTS";
import { UpgradeSection } from "./upgradeSection";
import { FarmState } from "../gameControl/farmState";
import { FarmLand } from "../models_structures/farmLand";
import { ButtonAddFarm } from "./addFarmButton";
import { ButtonAddMine } from "./addMineButton";
import { UpgradeWindow } from "./upgradeWindows";
import { MineState } from "../gameControl/mineState";
import { Miner } from "../models_characters/miner";
import { InSceneGUI } from "./inSceneGUI";
import { GameStateObserverI, GameStateI, MathStateObserverI, MathStateI } from "../../typings";
import { App } from "../app";
import { StartScreen } from "../scenes/start_screen";

export class GUIPlay implements GameStateObserverI, MathStateObserverI {
    private _app:App;
    private _gameState:GameStateI;
    private _mathState:MathStateI;
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

    //Bottom
    private _playGUIWrapperBottom:Rectangle;
    private _clickerBtn:Button;
    
    //castle
    public GUIWrapperCastleUpgrade:Rectangle;
    private _addMineButton:ButtonAddMine;
 
    //farms
    public GUIWrapperFarmUpgrade:Rectangle;
    public farmersMaxTextBox:TextBlock;
    private _wheatUpgrade:UpgradeSection;
    private _farmUpgrade01:UpgradeSection;
    private _farmUpgrade02:UpgradeSection;
    private _farmUpgrade03:UpgradeSection;
    private _farmUpgrade04:UpgradeSection;
    private _farmUpgradeSections:UpgradeSection[];
    private _addFarmUpgradeButton02:ButtonAddFarm;
    private _addFarmUpgradeButton03:ButtonAddFarm;
    private _addFarmUpgradeButton04:ButtonAddFarm;
    private _addFarmButtons:ButtonAddFarm[];

    //mine
    public wrapperMineUpgrade:Rectangle;
    private _mineUpgradeSection:UpgradeSection;
    public mineInSceneGUI:Rectangle;

    //blacksmith
    public GUIWrapperBlackSmithUpgrade:Rectangle;

    constructor(app:App, scene:PlayMode, gameState:GameStateI, mathState:MathStateI) {
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

        
        //FarmlandUpgrades
        //this is the GUI that Appears when you click on the Land to upgrade
        this.GUIWrapperFarmUpgrade = new UpgradeWindow('FarmUpgradeWindow' , 'brown', this);

        this.farmersMaxTextBox = new TextBlock('MaxFarmers', `Max Famers: ${this._mathState.farmersMax}`);
        this.farmersMaxTextBox.fontFamily = GUIFONT1;
        this.farmersMaxTextBox.top = -430;
        this.farmersMaxTextBox.width = .3;
        this.farmersMaxTextBox.color= 'white';
        this.GUIWrapperFarmUpgrade.addControl(this.farmersMaxTextBox);

        //this creates the wheat Upgrade section on the GUI
        this._wheatUpgrade = new UpgradeSection('Wheat', `adds %${wheatUpgradeValue * 100} gold/second`, this._mathState.costOfWheat, null, wheatUpgradesMax, this.GUIWrapperFarmUpgrade, -320, this, this.scene, () => this.wheatValueChange(), this._mathState);

        //this creates the farm Upgrade section on the GUI
        this._farmUpgrade01 = new UpgradeSection('farmUpgrade01', `next Uprade allows ${this._mathState.farmState01.farmersNextMax} total farmers on this land`, this._mathState.farmState01.farmUpgradeCost, null, farmUpgradeMax, this.GUIWrapperFarmUpgrade, -200, this, this.scene, () => this._farmUpGradeChange(this._mathState.farmState01, this._farmUpgrade01), null);
        
        this._farmUpgrade02 = new UpgradeSection('farmUpgrade02', `next Uprade allows ${this._mathState.farmState02.farmersNextMax} total farmers on this land`, this._mathState.farmState02.farmUpgradeCost, null, farmUpgradeMax, this.GUIWrapperFarmUpgrade, -80, this, this.scene, () => this._farmUpGradeChange(this._mathState.farmState02, this._farmUpgrade02), null);
        this._farmUpgrade02.wrapperUpgradeContainer.isVisible = false;
        
        this._farmUpgrade03 = new UpgradeSection('farmUpgrade03', `next Uprade allows ${this._mathState.farmState03.farmersNextMax} total farmers on this land`, this._mathState.farmState03.farmUpgradeCost, null, farmUpgradeMax, this.GUIWrapperFarmUpgrade, 40, this, this.scene, () => this._farmUpGradeChange(this._mathState.farmState03, this._farmUpgrade03), null);
        this._farmUpgrade03.wrapperUpgradeContainer.isVisible = false;

        this._farmUpgrade04 = new UpgradeSection('farmUpgrade04', `next Uprade allows ${this._mathState.farmState04.farmersNextMax} total farmers on this land`, this._mathState.farmState04.farmUpgradeCost, null, farmUpgradeMax, this.GUIWrapperFarmUpgrade, 160, this, this.scene, () => this._farmUpGradeChange(this._mathState.farmState04, this._farmUpgrade04), null);
        this._farmUpgrade04.wrapperUpgradeContainer.isVisible = false;
        this._farmUpgradeSections.push(this._farmUpgrade01, this._farmUpgrade02, this._farmUpgrade03, this._farmUpgrade04);
        
        //ADDFarm Buttons.
        this._addFarmButtons =[];

        this._addFarmUpgradeButton02 = new ButtonAddFarm('addFarmUpgrade_02', -80, this._farmUpgrade02, this._mathState.farmState02, this, 'addFarmUpgrade_03' );
        this.GUIWrapperFarmUpgrade.addControl(this._addFarmUpgradeButton02);

        this._addFarmUpgradeButton03 = new ButtonAddFarm('addFarmUpgrade_03', 40, this._farmUpgrade03, this._mathState.farmState03, this, 'addFarmUpgrade_04');
        this._addFarmUpgradeButton03.isEnabled = false;
        this._addFarmUpgradeButton03.isVisible = false;
        this.GUIWrapperFarmUpgrade.addControl(this._addFarmUpgradeButton03);

        this._addFarmUpgradeButton04 = new ButtonAddFarm('addFarmUpgrade_04', 160,this._farmUpgrade04, this._mathState.farmState04, this, null );
        this._addFarmUpgradeButton04.isEnabled = false;
        this._addFarmUpgradeButton04.isVisible = false;
        this.GUIWrapperFarmUpgrade.addControl(this._addFarmUpgradeButton04);

        this._addFarmButtons.push(this._addFarmUpgradeButton02, this._addFarmUpgradeButton03, this._addFarmUpgradeButton04);

        //this is the GUI that Appears whn you click on the Mine to upgrade
        this.wrapperMineUpgrade = new UpgradeWindow('mineUpgradeWindow', 'DarkSlateGray', this);
        const oreValue = oreUpgradeValue * 100;
        this._mineUpgradeSection = new UpgradeSection('MineUpgradeSection', `Speeds Up Ore Production by ${oreValue}%`, this._mathState.mineState.upgradeCostGold, ['farmers', this._mathState.mineState.upgradeCostFarmers], mineUpgradeMax, this.wrapperMineUpgrade, -320, this, this.scene, () => this._mineUpgradeChange(), null);

        this.mineInSceneGUI = new InSceneGUI('MineSceneGui', this, this.scene.mine, this._mathState.mineState, 'Ore');
        this.mineInSceneGUI.zIndex = -100;
        //blackSmith Upgrades
        //this is the GUI that Appears whn you click on the BlackSmith Building to upgrade
        this.GUIWrapperBlackSmithUpgrade = new UpgradeWindow('blackSmithUpgradeWindow', 'skyblue', this);

           //Castle Upgrades
        //this is the GUI that Appears when you click on the Castle to upgrade

        this.GUIWrapperCastleUpgrade = new UpgradeWindow('castleUpgradeWindow', 'gray', this);

        this._addMineButton = new ButtonAddMine(-320, this._mineUpgradeSection, this._mathState.mineState, this);
        this.GUIWrapperCastleUpgrade.addControl(this._addMineButton);

        //GAMELOOP//
        this.scene.onBeforeRenderObservable.add(() => {
            
            //wheat
            this._wheatUpgrade.upgradeAble = this._wheatUpgradeAllowed();

            //farms
            for (let i in this._farmUpgradeSections) {
                this._farmUpgradeSections[i].upgradeAble = this._farmUpgradeAllowed(this._mathState.farmStates[i]);
            }
            
            for (let i in this._addFarmButtons) {
                if(this._addFarmButtons[i].isVisible && this._mathState.totalGold > farmCost) {
                    this._addFarmButtons[i].isEnabled = true;
                } else if (this._addFarmButtons[i].isVisible && this._mathState.totalGold < farmCost) {
                    this._addFarmButtons[i].isEnabled = false;
                }
            }

            //mine
            this._mineUpgradeSection.upgradeAble = this._mineUpgradeAllow();
            
        })

    }

    private _clickFunction(){
            console.log('Add Farmer Button Clicked');
            //make a farmer and change the count
            this._makeFarmer(this._mathState.totalFarmers);  
    }

    public updateMathState(mathState: MathStateI): void {
        
        //Everytime the MathState Class runs the game loop these update.
        this._textBlockTotalFarmers.text = `${mathState.totalFarmers}`;
        this._totalGoldPerSecondTextBlock.text = `${mathState.goldPerSecond}`;
        this._totalGoldTextBlock.text = `${mathState.totalGold}`;
        this.farmersMaxTextBox.text = `Max Famers: ${this._mathState.farmersMax}`;
        this._textBlockTotalOre.text = `${this._mathState.totalOre}`;
        this._textBlockTotalLumens.text = `${this._mathState.totalLumens}`;
    }

    //wheat
    private _wheatUpgradeAllowed() {
        if (this._mathState.totalGold > this._mathState.costOfWheat) {
            return true;
        } else {
            return false;
        }
    }

     //Wheat
     public wheatValueChange() {
    
        if (this._mathState.wheatValue < wheatUpgradeValue * wheatUpgradesMax) {
            if (this._mathState.totalGold > this._mathState.costOfWheat) {
            
            //apply the value changes
            this._mathState.changeWheatValue();
            this._mathState.changeGoldPerSecond();

            //use gold
            this._mathState.spendGold(this._mathState.costOfWheat);
            
            //apply cost change
            this._mathState.upgradeWheat();
            this._mathState.changeCostOfWheat();
            }

        }
        
    }
    
    //farms
    private _farmUpgradeAllowed(farm:FarmState) {
        //this depends on whether the farm is completely upgraded or not.
        if (this._mathState.farmState01.upgradeLevel < farmUpgradeMax) {
            if (this._mathState.totalGold > farm.farmUpgradeCost) {
                return true;
            } else {
                return false;
            }
        }
    }
    
    //farmcallback
    private _farmUpGradeChange(farmState:FarmState, farmSection:UpgradeSection) {
        
        switch(farmState.upgradeLevel) {
            case 1: {
            
                const farmland = this.scene.getNodeByName(farmState.gamePieceName)as FarmLand;
                const position = farmland.farmHousePos;
                
                //upgrade the farm in the scene.
                const farmHouse = this.scene.farmHouse.clone(`${farmState.gamePieceName}_FarmHouse`,null,null);
                farmHouse.position = position;

            }
            break;
            //Other Upgrades go here.
        }
       
        //use gold
        this._mathState.spendGold(farmState.farmUpgradeCost);

        //upgrade the State
        farmState.changeState();
      
        //apply cost Changes
        this._mathState.changeFarmersMax();
        this.farmersMaxTextBox.text = `Max Famers: ${this._mathState.farmersMax}`;
        farmSection.goldCost = farmState.farmUpgradeCost;
        farmSection.instruction = `next Uprade allows ${farmState.farmersNextMax} total farmers on this land`
        farmSection.textBlockUpgradeInstruction.text = farmSection.instruction;

    }

    //mine
    private _mineUpgradeAllow() {
        if(this._mathState.mineState.upgradeLevel < mineUpgradeMax) {
            if(this._mathState.totalGold > this._mathState.mineState.upgradeCostGold && this._mathState.totalFarmers > this._mathState.mineState.upgradeCostFarmers) {
                return true;
            } else {
                return false;
            }
        }
    }

    //mine Callback
    private _mineUpgradeChange() {
        console.log('mineUpgradeChangeCalled');

        switch(this._mathState.mineState.upgradeLevel) {

            case 1 : {
                //remove the old model from the scene
                this.scene.mine.models[0].meshes.root.dispose();
                //make the next meshes Visible
                for(let i in this.scene.mine.models[1].meshes.allMeshes){
                    this.scene.mine.models[1].meshes.allMeshes[i].isVisible = true;
                } 
            }   
            break;
        
        }
        
        //use gold
        this._mathState.spendGold(this._mathState.mineState.upgradeCostGold);

        //use farmers
        this._mathState.spendFarmers(this._mathState.mineState.upgradeCostFarmers)

        //create and animate the Miner
        //we need the total number of miners
        let minerCount:number = this._mathState.mineState.upgradeCostFarmers;
        //then we need the farms that have been upgraded
        const usableFarmStates:FarmState[] = [];

        for(let i in this._mathState.farmStates) {
            if (this._mathState.farmStates[i].upgradeLevel >= 1) {
                usableFarmStates.push(this._mathState.farmStates[i]);
            }
        }

        const intervalAmount = (arraySize:number) => {
            return 240/arraySize;
        }
        
        if (minerCount >= 0) {
            let index = 0;
            let iterationCount = 0;
            
            let maxIterations  = Math.round(this._mathState.mineState.upgradeCostFarmers / usableFarmStates.length);

            const intervalId = setInterval(() => {
            this.makeMiner(minerCount, index);

            index++;

            if(index >= usableFarmStates.length) {
                index = 0;
            }

            iterationCount++;
            minerCount--;
        

            if(iterationCount >= maxIterations || minerCount <=0) {
                clearInterval(intervalId);
            }
            }, intervalAmount(usableFarmStates.length));
        }
        
        //upgrade the State
        this._mathState.mineState.changeState();

        //apply cost changes to GUI
        this._mineUpgradeSection.goldCost = this._mathState.mineState.upgradeCostGold;
        this._mineUpgradeSection.otherCost[1] = this._mathState.mineState.upgradeCostFarmers;
        

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
            new Farmer(currentCount.toLocaleString(), this.scene, this);
            this._mathState.makeFarmerRun(1);
        }  
    }
    
    public makeMiner(currentCount:number, farmState:number){
        new Miner(currentCount.toLocaleString(), this.scene, this, farmState);
    }

    public updateGameState(gamestate: GameStateI): void {
        if(this._gameState.state === 'END_SCREEN') {
          console.log('Game in EndScreen');
          //this._app.switchScene(this._app.playMode);
      }
        if(this._gameState.state === 'START_SCREEN') {
            console.log('Game in StartScreen');
            this._app.switchScene(new StartScreen(this._app.engine));
        }
    }

}