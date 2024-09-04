import { AdvancedDynamicTexture,  Button, Rectangle, Control, TextBlock} from "@babylonjs/gui";
import { GUIFONT1 } from "../utils/CONSTANTS";
import { Farmer } from "../models_characters/farmer";
import { PlayMode } from "../scenes/playmode";
import { farmerBaseValue } from "../utils/MATHCONSTANTS";

export class GUIPlay {
    public gameGUI:AdvancedDynamicTexture;
    public farmerCountTextBlock:TextBlock;
    public totalGoldPerSecondTextBlock:TextBlock;
    public totalGoldTextBlock:TextBlock;
    public farmerCount:number;
    public totalGold:number;
    public totalGoldPerSecond:number;

    private _scene:PlayMode;
    
    private _playScreenWrapper:Rectangle;
    private _textBlockFarmer:TextBlock
    private _textBlockGoldPerSecond:TextBlock
    
    constructor(scene:PlayMode) {
        this._scene = scene;
        
        this.farmerCount = 0
        this.totalGold = 0;
        this.totalGoldPerSecond = 0;


        this.gameGUI = AdvancedDynamicTexture.CreateFullscreenUI('GameGui')
        this.gameGUI.idealHeight = 1080;
        this.gameGUI.idealWidth = 1920;

        //playScreen
        this._playScreenWrapper = new Rectangle('wrapper');
        this._playScreenWrapper.width = 0.8;
        this._playScreenWrapper.thickness = 1;
        this.gameGUI.addControl(this._playScreenWrapper);
    
        //main clicker button
        const clickerBtn = Button.CreateSimpleButton("add", "Add");
        clickerBtn.fontFamily = GUIFONT1;
        clickerBtn.width = 0.2
        clickerBtn.height = "40px";
        clickerBtn.color = "white";
        clickerBtn.thickness = 2;
        clickerBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        
        this._playScreenWrapper.addControl(clickerBtn);

        clickerBtn.onPointerDownObservable.add(() => {
            //do the math
            this.farmerCount = this._makeFarmer(this.farmerCount);
            this.totalGoldPerSecond = this._farmerMultiplyer(this.farmerCount);
            
            //update the display
            this.farmerCountTextBlock.text = `${this.farmerCount}`;
            this.totalGoldPerSecondTextBlock.text = `${this.totalGoldPerSecond}`
        });

        this.farmerCountTextBlock = new TextBlock('FarmerCount', `${this.farmerCount}`);
        this.farmerCountTextBlock.fontFamily = GUIFONT1;
        this.farmerCountTextBlock.width = 200;
        this.farmerCountTextBlock.top = -460;
        this.farmerCountTextBlock.left= -30;
        this.farmerCountTextBlock.color = 'white';
        this._playScreenWrapper.addControl(this.farmerCountTextBlock);
        
        //this should be replaced with an image
        this._textBlockFarmer = new TextBlock('farmer', 'farmers');
        this._textBlockFarmer.fontFamily = GUIFONT1;
        this._textBlockFarmer.top = -460;
        this._textBlockFarmer.left= 30;
        this._textBlockFarmer.color = 'white';
        this._playScreenWrapper.addControl(this._textBlockFarmer);

        this.totalGoldPerSecondTextBlock = new TextBlock('TotalGoldPerSecond', `${this.totalGoldPerSecond}`);
        this.totalGoldPerSecondTextBlock.fontFamily =GUIFONT1;
        this.totalGoldPerSecondTextBlock.width = 200;
        this.totalGoldPerSecondTextBlock.top = -440;
        this.totalGoldPerSecondTextBlock.left= -35;
        this.totalGoldPerSecondTextBlock.color = "white";
        this._playScreenWrapper.addControl(this.totalGoldPerSecondTextBlock);

        this._textBlockGoldPerSecond = new TextBlock('GoldPerSecond', 'gold / second')
        this._textBlockGoldPerSecond.fontFamily = GUIFONT1;
        this._textBlockGoldPerSecond.top = -440;
        this._textBlockGoldPerSecond.left= 53;
        this._textBlockGoldPerSecond.color = 'white';
        this._playScreenWrapper.addControl(this._textBlockGoldPerSecond);    
        
        this.totalGoldTextBlock = new TextBlock('TotalGold', `${this.totalGold}`);
        this.totalGoldTextBlock.fontFamily = GUIFONT1;
        this.totalGoldTextBlock.width = 200;
        this.totalGoldTextBlock.top = -420;
        this.totalGoldTextBlock.left= -35 ;
        this.totalGoldTextBlock.color = 'white';
        this._playScreenWrapper.addControl(this.totalGoldTextBlock);

        //this should be replace by an image
        const textBlockGold = new TextBlock('gold', 'Gold');
        textBlockGold.fontFamily = GUIFONT1;
        textBlockGold.top = -420;
        textBlockGold.left= 16;
        textBlockGold.color = 'white';
        this._playScreenWrapper.addControl(textBlockGold);

        this._scene.onBeforeRenderObservable.add(() => {
  
            //console.log('test', roundedTotalGold);
            this.totalGoldTextBlock.text = `${this._finalMath()}`;

        })

    }

    private _finalMath() {
        this.totalGold = this.totalGold + (this.totalGoldPerSecond * (this._scene.getEngine().getDeltaTime()/1000));
            
        let roundedTotalGold = Math.round(this.totalGold * 1000) / 1000;

        return roundedTotalGold;
    }

    private _makeFarmer(currentCount:number) {
        //this creates the gamepiece
        new Farmer(currentCount.toLocaleString(), this._scene);
        //this ups the count;
        return currentCount + 1;

    }

    private _farmerMultiplyer(farmerCount:number) {

        return Math.round((farmerCount * farmerBaseValue) * 1000) /1000;
    
    }
}