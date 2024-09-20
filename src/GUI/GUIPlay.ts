import { AdvancedDynamicTexture,  Button, Rectangle, Control, TextBlock} from "@babylonjs/gui";
import { GUIFONT1 } from "../utils/CONSTANTS";
import { Farmer } from "../models_characters/farmer";
import { PlayMode } from "../scenes/playmode";
import { startingFarmers, startingGold, farmerBaseValue, wheatUpgradesMax, wheatUpgradeValue, wheatUpgradeCostGold, farmCost, farmersMax, farmUpgradeCost, farmUpgradeMax, mineUpgradeMax, oreUpgradeValue } from "../utils/MATHCONSTANTS";
import { UpgradeSection } from "./upgradeSection";
import { FarmState } from "./farmState";
import { FarmLand } from "../models_structures/farmLand";
import { ButtonAddFarm } from "./addFarmButton";
import { ButtonAddMine } from "./addMineButton";
import { UpgradeWindow } from "./upgradeWindows";
import { MineState } from "./mineState";
import { Miner } from "../models_characters/miner";
import { InSceneGUI } from "./inSceneGUI";

export class GUIPlay {
    //Math

    //farmers
    public totalFarmers:number;
    public runningFarmers:number;
    public farmersMax:number;
   
    //gold
    public totalGold:number;
    public totalGoldPerSecond:number;

    //wheat
    public wheatValue:number;
    private _wheatValueIncrement:number;
    private _costOfWheat:number;

    //ore
    public totalOre:number;
    public costOfOreGold:number;
    public timeToMakeOre:number;

    //structures
    //farms
    public farmState01:FarmState;
    public farmState02:FarmState;
    public farmState03:FarmState;
    public farmState04:FarmState;
    public farmStates:FarmState[];

    //mines
    public mineState:MineState;
 
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
    private _farmUpgrades:UpgradeSection[];
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

    constructor(scene:PlayMode) {
        this.scene = scene;
        //game Start Stats
        this.totalFarmers = startingFarmers;
        this.totalGold = startingGold;
        this.totalGoldPerSecond = this.totalFarmers/1000;

        //upgrades//
        //wheat
        this.wheatValue = 0;
        this._wheatValueIncrement = 1;
        //this sets the initial cost.
        this._costOfWheat = Math.round(wheatUpgradeCostGold(this._wheatValueIncrement)*1000)/1000;
        
        //farms
        this.farmState01 = new FarmState('Farm01', 'FarmLand01');
        this.farmState01.changeState();
        this.farmState02 = new FarmState('Farm02', 'FarmLand02');
        this.farmState03 = new FarmState('Farm03', 'FarmLand03');
        this.farmState04 = new FarmState('Farm04', 'FarmLand04');
        this.farmStates = [];
        this.farmStates.push(this.farmState01, this.farmState02, this.farmState03, this.farmState04);
        this._farmUpgrades = [];

        //farmers
        this.runningFarmers = 0;
        this.farmersMax = this.finalFarmerMaxMath();
        
        //mine
        this.mineState = new MineState();
        this.totalOre = 0;

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
        this._textBlockTotalFarmers = new TextBlock('FarmerCount', `${this.totalFarmers}`);
        this._textBlockTotalFarmers.fontFamily = GUIFONT1;
        this._textBlockTotalFarmers.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this._textBlockTotalFarmers.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this._textBlockTotalFarmers.top = 10;
        this._textBlockTotalFarmers.left= 720;
        this._textBlockTotalFarmers.color = 'white';
        this._playGUIWrapperTop.addControl(this._textBlockTotalFarmers);

        this._textBlockFarmer = new TextBlock('farmer', 'farmers');
        this._textBlockFarmer.fontFamily = GUIFONT1;
        this._textBlockFarmer.top = -30;
        this._textBlockFarmer.left= 35;
        this._textBlockFarmer.color = 'white';
        this._playGUIWrapperTop.addControl(this._textBlockFarmer);
        
        //GOLD
        this._totalGoldPerSecondTextBlock = new TextBlock('TotalGoldPerSecond', `${this.totalGoldPerSecond}`);
        this._totalGoldPerSecondTextBlock.fontFamily =GUIFONT1;
        this._totalGoldPerSecondTextBlock.top = -10;
        this._totalGoldPerSecondTextBlock.left= -35;
        this._totalGoldPerSecondTextBlock.color = "white";
        this._playGUIWrapperTop.addControl(this._totalGoldPerSecondTextBlock);

        this._textBlockGoldPerSecond = new TextBlock('GoldPerSecond', 'gold / second')
        this._textBlockGoldPerSecond.fontFamily = GUIFONT1;
        this._textBlockGoldPerSecond.top = -10;
        this._textBlockGoldPerSecond.left= 53;
        this._textBlockGoldPerSecond.color = 'white';
        this._playGUIWrapperTop.addControl(this._textBlockGoldPerSecond);    
        
        this._totalGoldTextBlock = new TextBlock('TotalGold', `${this.totalGold}`);
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
        
        //ORE
        this._textBlockTotalOre = new TextBlock('TotalOre', `${this.totalOre}`);
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
        this._clickerBtn = Button.CreateSimpleButton("add", "Add");
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

        this.farmersMaxTextBox = new TextBlock('MaxFarmers', `Max Famers: ${this.farmersMax}`);
        this.farmersMaxTextBox.fontFamily = GUIFONT1;
        this.farmersMaxTextBox.top = -430;
        this.farmersMaxTextBox.width = .3;
        this.farmersMaxTextBox.color= 'white';
        this.GUIWrapperFarmUpgrade.addControl(this.farmersMaxTextBox);

        //this creates the wheat Upgrade section on the GUI
        this._wheatUpgrade = new UpgradeSection('Wheat', `adds %${wheatUpgradeValue * 100} gold/second`, this._costOfWheat, null, wheatUpgradesMax, this.GUIWrapperFarmUpgrade, -320, this, this.scene, () => this._wheatValueChange());

        //this creates the farm Upgrade section on the GUI
        this._farmUpgrade01 = new UpgradeSection('farmUpgrade01', `next Uprade allows ${this.farmState01.farmersNextMax} total farmers on this land`, this.farmState01.farmUpgradeCost, null, farmUpgradeMax, this.GUIWrapperFarmUpgrade, -200, this, this.scene, () => this._farmUpGradeChange(this.farmState01, this._farmUpgrade01));
        
        this._farmUpgrade02 = new UpgradeSection('farmUpgrade02', `next Uprade allows ${this.farmState02.farmersNextMax} total farmers on this land`, this.farmState02.farmUpgradeCost, null, farmUpgradeMax, this.GUIWrapperFarmUpgrade, -80, this, this.scene, () => this._farmUpGradeChange(this.farmState02, this._farmUpgrade02));
        this._farmUpgrade02.wrapperUpgradeContainer.isVisible = false;
        
        this._farmUpgrade03 = new UpgradeSection('farmUpgrade03', `next Uprade allows ${this.farmState03.farmersNextMax} total farmers on this land`, this.farmState03.farmUpgradeCost, null, farmUpgradeMax, this.GUIWrapperFarmUpgrade, 40, this, this.scene, () => this._farmUpGradeChange(this.farmState03, this._farmUpgrade03));
        this._farmUpgrade03.wrapperUpgradeContainer.isVisible = false;

        this._farmUpgrade04 = new UpgradeSection('farmUpgrade04', `next Uprade allows ${this.farmState04.farmersNextMax} total farmers on this land`, this.farmState04.farmUpgradeCost, null, farmUpgradeMax, this.GUIWrapperFarmUpgrade, 160, this, this.scene, () => this._farmUpGradeChange(this.farmState04, this._farmUpgrade04));
        this._farmUpgrade04.wrapperUpgradeContainer.isVisible = false;
        this._farmUpgrades.push(this._farmUpgrade01, this._farmUpgrade02, this._farmUpgrade03, this._farmUpgrade04);
        
        //ADDFarm Buttons.
        this._addFarmButtons =[];

        this._addFarmUpgradeButton02 = new ButtonAddFarm('addFarmUpgrade_02', -80, this._farmUpgrade02, this.farmState02, this, 'addFarmUpgrade_03' );
        this.GUIWrapperFarmUpgrade.addControl(this._addFarmUpgradeButton02);

        this._addFarmUpgradeButton03 = new ButtonAddFarm('addFarmUpgrade_03', 40, this._farmUpgrade03, this.farmState03, this, 'addFarmUpgrade_04');
        this._addFarmUpgradeButton03.isEnabled = false;
        this._addFarmUpgradeButton03.isVisible = false;
        this.GUIWrapperFarmUpgrade.addControl(this._addFarmUpgradeButton03);

        this._addFarmUpgradeButton04 = new ButtonAddFarm('addFarmUpgrade_04', 160,this._farmUpgrade04, this.farmState04, this, null );
        this._addFarmUpgradeButton04.isEnabled = false;
        this._addFarmUpgradeButton04.isVisible = false;
        this.GUIWrapperFarmUpgrade.addControl(this._addFarmUpgradeButton04);

        this._addFarmButtons.push(this._addFarmUpgradeButton02, this._addFarmUpgradeButton03, this._addFarmUpgradeButton04);

        //this is the GUI that Appears whn you click on the Mine to upgrade
        this.wrapperMineUpgrade = new UpgradeWindow('mineUpgradeWindow', 'DarkSlateGray', this);
        const oreValue = oreUpgradeValue * 100;
        this._mineUpgradeSection = new UpgradeSection('MineUpgradeSection', `Speeds Up Ore Production by ${oreValue}%`, this.mineState.upgradeCostGold, ['farmers', this.mineState.upgradeCostFarmers], mineUpgradeMax, this.wrapperMineUpgrade, -320, this, this.scene, () => this._mineUpgradeChange());

        this.mineInSceneGUI = new InSceneGUI('MineSceneGui', this, this.scene.mine, this.mineState, 'Ore');
        this.mineInSceneGUI.zIndex = -100;
        //blackSmith Upgrades
        //this is the GUI that Appears whn you click on the BlackSmith Building to upgrade
        this.GUIWrapperBlackSmithUpgrade = new UpgradeWindow('blackSmithUpgradeWindow', 'skyblue', this);

           //Castle Upgrades
        //this is the GUI that Appears when you click on the Castle to upgrade

        this.GUIWrapperCastleUpgrade = new UpgradeWindow('castleUpgradeWindow', 'gray', this);

        this._addMineButton = new ButtonAddMine(-320, this._mineUpgradeSection, this.mineState, this);
        this.GUIWrapperCastleUpgrade.addControl(this._addMineButton);

        //GAMELOOP//
        this.scene.onBeforeRenderObservable.add(() => {

            //goldperSecond
            this.totalGoldPerSecond = this.changeGoldPerSecond();
            this._totalGoldPerSecondTextBlock.text = `${this.totalGoldPerSecond}`;

            //gold
            this._totalGoldTextBlock.text = `${this._finalGoldMath()}`;
            this._textBlockTotalFarmers.text = `${this.totalFarmers}`;

            //ore
            this._textBlockTotalOre.text = `${this.totalOre}`;
            //wheat
            this._wheatUpgrade.upgradeAble = this._wheatUpgradeAllowed();

            //farms
            for (let i in this._farmUpgrades) {
                this._farmUpgrades[i].upgradeAble = this._farmUpgradeAllowed(this.farmStates[i]);
            }
            
            for (let i in this._addFarmButtons) {
                if(this._addFarmButtons[i].isVisible && this.totalGold > farmCost) {
                    this._addFarmButtons[i].isEnabled = true;
                } else if (this._addFarmButtons[i].isVisible && this.totalGold < farmCost) {
                    this._addFarmButtons[i].isEnabled = false;
                }
            }

            //mine
            this._mineUpgradeSection.upgradeAble = this._mineUpgradeAllow();
            

        })

    }

    private _clickFunction(){

        if(this.totalFarmers + this.runningFarmers < this.farmersMax) {
            //make a farmer and change the count
            this._makeFarmer(this.totalFarmers);
            this.runningFarmers += 1;
        }
        
    }

    //math functions
    //All math should go in finalMath
    private _finalGoldMath() {
        
        this.totalGold = this.totalGold + (this.totalGoldPerSecond * (this.scene.getEngine().getDeltaTime()/1000));
            
        let roundedTotalGold = Math.round(this.totalGold * 1000) / 1000;

        return roundedTotalGold;
    
    }

    public changeGoldPerSecond() {

        return Math.round((1 + this.wheatValue) * this._farmerMultiplyer(this.totalFarmers)* 1000) /1000;


    }

    public finalFarmerMaxMath(){
        let total = 0;

        for (let i in this.farmStates) {
            total = total + this.farmStates[i].farmersMax;
        }
        
        return total;
    }

    public changeFarmerCount() {

        return this.totalFarmers + 1;

    }

    private _farmerMultiplyer(totalFarmers:number) {

        return Math.round((totalFarmers * farmerBaseValue) * 1000) /1000;
    
    }

    //wheat
    private _wheatUpgradeAllowed() {
        if (this.totalGold > this._costOfWheat) {
            return true;
        } else {
            return false;
        }
    }
    
    //wheat Callback
    private _wheatValueChange() {
       
        if (this.wheatValue < wheatUpgradeValue * wheatUpgradesMax) {
            if (this.totalGold > this._costOfWheat) {
            
            //apply the value changes
            this.wheatValue = Math.round((this.wheatValue + wheatUpgradeValue)*100)/100;
            this.totalGoldPerSecond = Math.round(this.changeGoldPerSecond() * 10000)/10000;
            
            //use gold
            this.totalGold = this.totalGold - this._costOfWheat;

            //apply cost change
            this._wheatValueIncrement += 1;
            this._costOfWheat = Math.round(wheatUpgradeCostGold(this._wheatValueIncrement)* 1000)/1000;
            this._wheatUpgrade.goldCost = this._costOfWheat;

            }

        }
        
    }
    //farms
    private _farmUpgradeAllowed(farm:FarmState) {
        //this depends on whether the farm is completely upgraded or not.
        if (this.farmState01.upgradeLevel < farmUpgradeMax) {
            if (this.totalGold > farm.farmUpgradeCost) {
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
        this.totalGold = this.totalGold - farmState.farmUpgradeCost;

        //upgrade the State
        farmState.changeState();
      
        //apply cost Changes
        this.farmersMax = this.finalFarmerMaxMath();
        this.farmersMaxTextBox.text = `Max Famers: ${this.farmersMax}`;
        farmSection.goldCost = farmState.farmUpgradeCost;
        farmSection.instruction = `next Uprade allows ${farmState.farmersNextMax} total farmers on this land`
        farmSection.textBlockUpgradeInstruction.text = farmSection.instruction;


    }

    //mine
    private _mineUpgradeAllow() {
        if(this.mineState.upgradeLevel < mineUpgradeMax) {
            if(this.totalGold > this.mineState.upgradeCostGold && this.totalFarmers > this.mineState.upgradeCostFarmers) {
                return true;
            } else {
                return false;
            }
        }
    }

    //mine Callback
    private _mineUpgradeChange() {
        console.log('mineUpgradeChangeCalled');

        switch(this.mineState.upgradeLevel) {

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
        this.totalGold = this.totalGold - this.mineState.upgradeCostGold;

        //use farmers
        this.totalFarmers = this.totalFarmers = this.mineState.upgradeCostFarmers;

        //create and animate the Miners

        //we need the total number of miners
        let minerCount:number = this.mineState.upgradeCostFarmers;
        //then we need the farms that have been upgraded
        const usableFarmStates:FarmState[] = [];

        for(let i in this.farmStates) {
            if (this.farmStates[i].upgradeLevel >= 1) {
                usableFarmStates.push(this.farmStates[i]);
            }
        }

        const intervalAmount = (arraySize:number) => {
            return 240/arraySize;
        }
        
        if (minerCount >= 0) {
            let index = 0;
            let iterationCount = 0;
            
            let maxIterations  = Math.round(this.mineState.upgradeCostFarmers / usableFarmStates.length);

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
        this.mineState.changeState();

        //apply cost changes
        this._mineUpgradeSection.goldCost = this.mineState.upgradeCostGold;
        this._mineUpgradeSection.otherCost[1] = this.mineState.upgradeCostFarmers;
        

    }

    //GUI functions
    public showUpgrades(wrapper:Rectangle) {
        
        if (!wrapper.isVisible) {
            
            wrapper.isVisible = true;
        
        }
    }
    
    //Game interaction functions
    private _makeFarmer(currentCount:number) {
        
        new Farmer(currentCount.toLocaleString(), this.scene, this);

    }
    
    public makeMiner(currentCount:number, farmState:number){
        new Miner(currentCount.toLocaleString(), this.scene, this, farmState);
    } 

}