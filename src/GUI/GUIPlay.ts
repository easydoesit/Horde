import { AdvancedDynamicTexture,  Button, Rectangle, Control, TextBlock} from "@babylonjs/gui";
import { GUIFONT1 } from "../utils/CONSTANTS";
import { Farmer } from "../models_characters/farmer";
import { PlayMode } from "../scenes/playmode";
import { startingFarmers, startingGold, farmerBaseValue, wheatUpgradesMax, wheatUpgradeValue, wheatUpgradeCostGold, farmCost, farmersMax, farmUpgradeCost, farmUpgradeMax } from "../utils/MATHCONSTANTS";
import { UpgradeSection } from "./upgradeSection";
import { FarmState } from "./farmState";
import { FarmLand } from "../models_structures/farmLand";
import { ButtonAddFarm } from "./addFarmButton";

export class GUIPlay {
    //Math
    public farmerCount:number;
    public totalGold:number;
    public totalGoldPerSecond:number;
    
    //wheat
    public wheatValue:number;
    private _wheatValueIncrement:number;
    private _costOfWheat:number;

    //farmers
    public runningFarmers:number;
    public farmersMax:number;

    public farm01:FarmState;
    public farm02:FarmState;
    public farm03:FarmState;
    public farm04:FarmState;
    public farmStates:FarmState[];

    private _scene:PlayMode;
    
    //GUI
    private _gameGUI:AdvancedDynamicTexture;
    
    private _playGUIWrapperTop:Rectangle;
    private _farmerCountTextBlock:TextBlock;
    private _totalGoldPerSecondTextBlock:TextBlock;
    private _totalGoldTextBlock:TextBlock;
    private _textBlockGold:TextBlock
    private _textBlockFarmer:TextBlock;
    private _textBlockGoldPerSecond:TextBlock;
    private _openUpgrades:Button;

    private _playGUIWrapperBottom:Rectangle;
    private _clickerBtn:Button;

    private _playGUIWrapperUpgrade:Rectangle;
    private _closeUpgrades:Button;
    private _wheatUpgrade:UpgradeSection;
 
    public playGUIWrapperFarmUpgrade:Rectangle;
    private _closeLandUpgrades:Button;
    public farmersMaxTextBox:TextBlock;
    private _farmUpgrade01:UpgradeSection;
    private _farmUpgrade02:UpgradeSection;
    private _farmUpgrade03:UpgradeSection;
    private _farmUpgrade04:UpgradeSection;
    private _farmUpgrades:UpgradeSection[];
    private _addFarmUpgradeButton02:ButtonAddFarm;
    private _addFarmUpgradeButton03:ButtonAddFarm;
    private _addFarmUpgradeButton04:ButtonAddFarm;
    private _addFarmButtons:ButtonAddFarm[];
    
    constructor(scene:PlayMode) {
        this._scene = scene;
        //game Start Stats
        this.farmerCount = startingFarmers;
        this.totalGold = startingGold;
        this.totalGoldPerSecond = this.farmerCount/1000;

        //upgrades//
        //wheat
        this.wheatValue = 0;
        this._wheatValueIncrement = 1;
        //this sets the initial cost.
        this._costOfWheat = Math.round(wheatUpgradeCostGold(this._wheatValueIncrement)*1000)/1000;
        
        //farms
        this.farm01 = new FarmState('Farm01', 'FarmLand01');
        this.farm01.changeState();
        this.farm02 = new FarmState('Farm02', 'FarmLand02');
        this.farm03 = new FarmState('Farm03', 'FarmLand03');
        this.farm04 = new FarmState('Farm04', 'FarmLand04');
        this.farmStates = [];
        this.farmStates.push(this.farm01, this.farm02, this.farm03, this.farm04);
        this._farmUpgrades = [];

        //farmers
        this.runningFarmers = 0;
        this.farmersMax = this.finalFarmerMaxMath();
        
        //GUI//
        this._gameGUI = AdvancedDynamicTexture.CreateFullscreenUI('GameGui')
        this._gameGUI.idealHeight = 1080;
        this._gameGUI.idealWidth = 1920;
        
        //TOP
        //playGUITop
        this._playGUIWrapperTop = new Rectangle('playGUIWrapperTop');
        this._playGUIWrapperTop.width = 0.8;
        this._playGUIWrapperTop.height= 0.1;
        this._playGUIWrapperTop.thickness = 1;
        this._playGUIWrapperTop.top = -400;
        this._gameGUI.addControl(this._playGUIWrapperTop);
    
        this._farmerCountTextBlock = new TextBlock('FarmerCount', `${this.farmerCount}`);
        this._farmerCountTextBlock.fontFamily = GUIFONT1;
        this._farmerCountTextBlock.width = 200;
        this._farmerCountTextBlock.top = -30;
        this._farmerCountTextBlock.left= -35;
        this._farmerCountTextBlock.color = 'white';
        this._playGUIWrapperTop.addControl(this._farmerCountTextBlock);
        
        //this should be replaced with an image
        this._textBlockFarmer = new TextBlock('farmer', 'farmers');
        this._textBlockFarmer.fontFamily = GUIFONT1;
        this._textBlockFarmer.top = -30;
        this._textBlockFarmer.left= 35;
        this._textBlockFarmer.color = 'white';
        this._playGUIWrapperTop.addControl(this._textBlockFarmer);

        this._totalGoldPerSecondTextBlock = new TextBlock('TotalGoldPerSecond', `${this.totalGoldPerSecond}`);
        this._totalGoldPerSecondTextBlock.fontFamily =GUIFONT1;
        this._totalGoldPerSecondTextBlock.width = 200;
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
        this._totalGoldTextBlock.width = 200;
        this._totalGoldTextBlock.top = 10;
        this._totalGoldTextBlock.left= -35 ;
        this._totalGoldTextBlock.color = 'white';
        this._playGUIWrapperTop.addControl(this._totalGoldTextBlock);

        //this should be replace by an image
        this._textBlockGold = new TextBlock('gold', 'Gold');
        this._textBlockGold.fontFamily = GUIFONT1;
        this._textBlockGold.top = 10;
        this._textBlockGold.left= 16;
        this._textBlockGold.color = 'white';
        this._playGUIWrapperTop.addControl(this._textBlockGold);

        this._openUpgrades = Button.CreateSimpleButton('openUpgrades', 'Upgrades');
        this._openUpgrades.fontFamily =GUIFONT1;
        this._openUpgrades.left = -600;
        this._openUpgrades.width = .15;
        this._openUpgrades.height = .75;
        this._openUpgrades.background = 'red';
        this._openUpgrades.color= 'white';
        this._playGUIWrapperTop.addControl(this._openUpgrades);

        this._openUpgrades.onPointerDownObservable.add(() => {
            
            this.showUpgrades(this._playGUIWrapperUpgrade);
            this._openUpgrades.isVisible = false;
        
        });
        

         //Bottom
        //playGUIBottom
        this._playGUIWrapperBottom = new Rectangle('playGUIWrapperBottom');
        this._playGUIWrapperBottom.width = 0.8;
        this._playGUIWrapperBottom.height= 0.1;
        this._playGUIWrapperBottom.thickness = 1;
        this._playGUIWrapperBottom.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this._gameGUI.addControl(this._playGUIWrapperBottom);


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

        ///Upgrade
        //playGUIUpgrade
        this._playGUIWrapperUpgrade = new Rectangle('playGUIWrapperUpgrade');
        this._playGUIWrapperUpgrade.width = 0.5;
        this._playGUIWrapperUpgrade.height= 1;
        this._playGUIWrapperUpgrade.thickness = 1;
        this._playGUIWrapperUpgrade.background = 'white';
        this._gameGUI.addControl(this._playGUIWrapperUpgrade);

        this._playGUIWrapperUpgrade.isVisible = false;

        this._closeUpgrades = Button.CreateSimpleButton('closeUpgrades', 'close');
        this._closeUpgrades.fontFamily = GUIFONT1;
        this._closeUpgrades.left = 430;
        this._closeUpgrades.top = -430;
        this._closeUpgrades.width = .075;
        this._closeUpgrades.height = .075;
        this._closeUpgrades.background = 'red';
        this._closeUpgrades.color= 'white';
        this._playGUIWrapperUpgrade.addControl(this._closeUpgrades);

        this._closeUpgrades.onPointerDownObservable.add(() => {
            
            this._openUpgrades.isVisible = true;
            this.hideUpgrades(this._playGUIWrapperUpgrade);
            
        
        });
        //this creates the wheat Upgrade section on the GUI
        this._wheatUpgrade = new UpgradeSection('Wheat', `adds %${wheatUpgradeValue * 100} gold/second`, this._costOfWheat, wheatUpgradesMax, this._playGUIWrapperUpgrade, -320, this, this._scene, () => this._wheatValueChange());

        //landUpgrades
        //this is the GUI that Appears whn you click on the Land to upgrade
        this.playGUIWrapperFarmUpgrade = new Rectangle('playGUIWrapperUpgrade');
        this.playGUIWrapperFarmUpgrade.width = 0.5;
        this.playGUIWrapperFarmUpgrade.height= 1;
        this.playGUIWrapperFarmUpgrade.thickness = 1;
        this.playGUIWrapperFarmUpgrade.background = 'brown';
        this._gameGUI.addControl(this.playGUIWrapperFarmUpgrade);
        //hide this Wrapper to start
        this.playGUIWrapperFarmUpgrade.isVisible = false;
        
        this._closeLandUpgrades = Button.CreateSimpleButton('closeUpgrades', 'close');
        this._closeLandUpgrades.fontFamily = GUIFONT1;
        this._closeLandUpgrades.left = 430;
        this._closeLandUpgrades.top = -430;
        this._closeLandUpgrades.width = .075;
        this._closeLandUpgrades.height = .075;
        this._closeLandUpgrades.background = 'red';
        this._closeLandUpgrades.color= 'white';
        this.playGUIWrapperFarmUpgrade.addControl(this._closeLandUpgrades);

        this._closeLandUpgrades.onPointerDownObservable.add(() => {
            
            this.hideUpgrades(this.playGUIWrapperFarmUpgrade);
        
        });

        this.farmersMaxTextBox = new TextBlock('MaxFarmers', `Max Famers: ${this.farmersMax}`);
        this.farmersMaxTextBox.fontFamily = GUIFONT1;
        this.farmersMaxTextBox.top = -430;
        this.farmersMaxTextBox.width = .3;
        this.farmersMaxTextBox.color= 'white';
        this.playGUIWrapperFarmUpgrade.addControl(this.farmersMaxTextBox);

        //this creates the farm Upgrade section on the GUI
        this._farmUpgrade01 = new UpgradeSection('FarmLand 1 Upgrade', `next Uprade allows ${this.farm01.farmersNextMax} total farmers on this land`, this.farm01.farmUpgradeCost, farmUpgradeMax, this.playGUIWrapperFarmUpgrade, -320, this, this._scene, () => this._farmUpGradeChange(this.farm01));
        
        this._farmUpgrade02 = new UpgradeSection('FarmLand 2 Upgrade', `next Uprade allows ${this.farm02.farmersNextMax} total farmers on this land`, this.farm02.farmUpgradeCost, farmUpgradeMax, this.playGUIWrapperFarmUpgrade, -200, this, this._scene, () => this._farmUpGradeChange(this.farm02));
        this._farmUpgrade02.wrapperUpgradeContainer.isVisible = false;
        
        this._farmUpgrade03 = new UpgradeSection('FarmLand 3 Upgrade', `next Uprade allows ${this.farm03.farmersNextMax} total farmers on this land`, this.farm03.farmUpgradeCost, farmUpgradeMax, this.playGUIWrapperFarmUpgrade, -80, this, this._scene, () => this._farmUpGradeChange(this.farm03));
        this._farmUpgrade03.wrapperUpgradeContainer.isVisible = false;

        this._farmUpgrade04 = new UpgradeSection('FarmLand 3 Upgrade', `next Uprade allows ${this.farm04.farmersNextMax} total farmers on this land`, this.farm04.farmUpgradeCost, farmUpgradeMax, this.playGUIWrapperFarmUpgrade, 40, this, this._scene, () => this._farmUpGradeChange(this.farm04));
        this._farmUpgrade04.wrapperUpgradeContainer.isVisible = false;
        this._farmUpgrades.push(this._farmUpgrade01, this._farmUpgrade01, this._farmUpgrade03, this._farmUpgrade04);
        
        //ADDFarm Buttons.
        this._addFarmButtons =[];

        this._addFarmUpgradeButton02 = new ButtonAddFarm('addFarmUpgrade_02', -200, this._farmUpgrade02, this.farm02, this, 'addFarmUpgrade_03' );
        this.playGUIWrapperFarmUpgrade.addControl(this._addFarmUpgradeButton02);

        this._addFarmUpgradeButton03 = new ButtonAddFarm('addFarmUpgrade_03', -80, this._farmUpgrade03, this.farm03, this, 'addFarmUpgrade_04');
        this._addFarmUpgradeButton03.isEnabled = false;
        this._addFarmUpgradeButton03.isVisible = false;
        this.playGUIWrapperFarmUpgrade.addControl(this._addFarmUpgradeButton03);

        this._addFarmUpgradeButton04 = new ButtonAddFarm('addFarmUpgrade_04', 40,this._farmUpgrade04, this.farm04, this, null );
        this._addFarmUpgradeButton04.isEnabled = false;
        this._addFarmUpgradeButton04.isVisible = false;
        this.playGUIWrapperFarmUpgrade.addControl(this._addFarmUpgradeButton04);

        this._addFarmButtons.push(this._addFarmUpgradeButton02, this._addFarmUpgradeButton03, this._addFarmUpgradeButton04);

        //GAMELOOP//
        this._scene.onBeforeRenderObservable.add(() => {

            //gold
            this._totalGoldTextBlock.text = `${this._finalGoldMath()}`;
            this._farmerCountTextBlock.text = `${this.farmerCount}`;
            this._totalGoldPerSecondTextBlock.text = `${this.totalGoldPerSecond}`;

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

        })

    }

    private _clickFunction(){

        if(this.farmerCount + this.runningFarmers < this.farmersMax) {
            //make a farmer and increase the count
            this._makeFarmer(this.farmerCount);
            this.runningFarmers += 1;
        }
        
    }

    //math functions
    //All math should go in finalMath
    private _finalGoldMath() {
        
        this.totalGold = this.totalGold + (this.totalGoldPerSecond * (this._scene.getEngine().getDeltaTime()/1000));
            
        let roundedTotalGold = Math.round(this.totalGold * 1000) / 1000;

        return roundedTotalGold;
    
    }

    public increaseGoldPerSecond() {

        return (1 + this.wheatValue) * this._farmerMultiplyer(this.farmerCount);


    }

    public finalFarmerMaxMath(){
        let total = 0;

        for (let i in this.farmStates) {
            total = total + this.farmStates[i].farmersMax;
        }
        
        return total;
    }

    public increaseFarmerCount() {

        return this.farmerCount + 1;

    }

    private _farmerMultiplyer(farmerCount:number) {

        return Math.round((farmerCount * farmerBaseValue) * 1000) /1000;
    
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
        console.log("wheatValueChange CAlled");
        if (this.wheatValue < wheatUpgradeValue * wheatUpgradesMax) {
            if (this.totalGold > this._costOfWheat) {
            
            //apply the value increases
            this.wheatValue = Math.round((this.wheatValue + wheatUpgradeValue)*100)/100;
            this.totalGoldPerSecond = Math.round(this.increaseGoldPerSecond() * 10000)/10000;
            
            //use gold
            this.totalGold = this.totalGold - this._costOfWheat;

            //apply cost change
            this._wheatValueIncrement += 1;
            this._costOfWheat = Math.round(wheatUpgradeCostGold(this._wheatValueIncrement)* 1000)/1000;
            this._wheatUpgrade.cost = this._costOfWheat;

            }

        }
        
    }
    //farms
    private _farmUpgradeAllowed(farm:FarmState) {
        //this depends on whether the farm is completely upgraded or not.
        if (this.farm01.upgradeLevel < farmUpgradeMax) {
            if (this.totalGold > farm.farmUpgradeCost) {
                return true;
            } else {
                return false;
            }
        }
    }
    
    //farmcallback
    private _farmUpGradeChange(farmState:FarmState, ) {

        switch(farmState.upgradeLevel) {
            case 1: {
            
                const farmland = this._scene.getNodeByName(farmState.gamePiece)as FarmLand;
                const position = farmland.farmHousePos;
                
                //upgrade the farm in the scene.
                const farmHouse = this._scene.farmHouse.clone(`${farmState.gamePiece}_FarmHouse`,null,null);
                farmHouse.position = position;

            }
            break;
        }
       
        //use gold
        this.totalGold = this.totalGold - farmState.farmUpgradeCost;

        //upgrade the State
        farmState.changeState();

        //apply cost Changes
        this.farmersMax = this.finalFarmerMaxMath();
        this.farmersMaxTextBox.text = `Max Famers: ${this.farmersMax}`;
        this._farmUpgrade01.cost = farmState.farmUpgradeCost;
        
    }

    //GUI functions
    public showUpgrades(wrapper:Rectangle) {
        
        if (!wrapper.isVisible) {
            
            wrapper.isVisible = true;
        
        }
    }

    public hideUpgrades(wrapper:Rectangle) {

        if (wrapper.isVisible) {

            wrapper.isVisible = false;
        }
    }

    //GUI farm Functions
    

    //Game interaction functions
    private _makeFarmer(currentCount:number) {
        
        new Farmer(currentCount.toLocaleString(), this._scene, this);

    }

}