import { AdvancedDynamicTexture,  Button, Rectangle, Control, TextBlock} from "@babylonjs/gui";
import { GUIFONT1 } from "../utils/CONSTANTS";
import { Farmer } from "../models_characters/farmer";
import { PlayMode } from "../scenes/playmode";
import { farmerBaseValue, wheatUpgradesMax, wheatUpgradeValue } from "../utils/MATHCONSTANTS";
import { UpgradeSection } from "./upgradeSection";

export class GUIPlay {
    //Math
    public farmerCount:number;
    public totalGold:number;
    public totalGoldPerSecond:number;
    public wheatValue:number;

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
 
    
    constructor(scene:PlayMode) {
        this._scene = scene;
        this.farmerCount = 0
        this.totalGold = 0;
        this.totalGoldPerSecond = 0;

        //upgrades
        this.wheatValue = 0;


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
            
            this._showUpgrades();
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
        this._closeUpgrades.fontFamily =GUIFONT1;
        this._closeUpgrades.left = 430;
        this._closeUpgrades.top = -430;
        this._closeUpgrades.width = .075;
        this._closeUpgrades.height = .075;
        this._closeUpgrades.background = 'red';
        this._closeUpgrades.color= 'white';
        this._playGUIWrapperUpgrade.addControl(this._closeUpgrades);

        this._closeUpgrades.onPointerDownObservable.add(() => {
            
            this._openUpgrades.isVisible = true;
            this._hideUpgrades();
            
        
        });
        //this creates the wheat Upgrade section on the GUI
        this._wheatUpgrade = new UpgradeSection('Wheat', 'adds 5% gold/second', wheatUpgradeValue, wheatUpgradesMax, this._playGUIWrapperUpgrade, this, this._wheatValueChange.bind(this));

        //GameLoop
        this._scene.onBeforeRenderObservable.add(() => {
            console.log('full G/S', this.totalGoldPerSecond);
            console.log('wheatValue', this.wheatValue);
            
            this._totalGoldTextBlock.text = `${this._finalMath()}`;
            this._farmerCountTextBlock.text = `${this.farmerCount}`;
            this._totalGoldPerSecondTextBlock.text = `${this.totalGoldPerSecond}`

        })

    }

    private _clickFunction(){
           
        //make a farmer and increase the count
        this._makeFarmer(this.farmerCount);
        //this.farmerCount = this._increaseFarmerCount();
        
        //up the Goldpersecond
        // this.totalGoldPerSecond = Math.round(this.increaseGoldPerSecond()*10000)/10000;
        

    }

    //math functions
    //All math should go in finalMath
    private _finalMath() {
        
        this.totalGold = this.totalGold + (this.totalGoldPerSecond * (this._scene.getEngine().getDeltaTime()/1000));
            
        let roundedTotalGold = Math.round(this.totalGold * 1000) / 1000;

        return roundedTotalGold;
    
    }

    public increaseGoldPerSecond() {

        return (1 + this.wheatValue) * this._farmerMultiplyer(this.farmerCount);


    }

    public increaseFarmerCount() {

        return this.farmerCount + 1;

    }

    private _farmerMultiplyer(farmerCount:number) {

        return Math.round((farmerCount * farmerBaseValue) * 1000) /1000;
    
    }


    private _wheatValueChange() {

        if (this.wheatValue < wheatUpgradeValue * wheatUpgradesMax) {
            
            this.wheatValue = Math.round((this.wheatValue + wheatUpgradeValue)*100)/100;

            this.totalGoldPerSecond  = Math.round(this.increaseGoldPerSecond() * 10000)/10000;
        
        }
        
    }


    //GUI functions
    private _showUpgrades() {
        
        if (!this._playGUIWrapperUpgrade.isVisible) {
            
            this._playGUIWrapperUpgrade.isVisible = true;
        
        }
    }

    private _hideUpgrades() {

        if (this._playGUIWrapperUpgrade.isVisible) {

            this._playGUIWrapperUpgrade.isVisible = false;
        }
    }

    //Game interaction functions
    private _makeFarmer(currentCount:number) {
        
        new Farmer(currentCount.toLocaleString(), this._scene, this);

    }

}