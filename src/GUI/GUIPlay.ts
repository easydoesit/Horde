import { AdvancedDynamicTexture,  Button, Rectangle, Control, TextBlock} from "@babylonjs/gui";
import { Scene } from "@babylonjs/core";
import { GUIFONT1 } from "../utils/CONSTANTS";
import { Farmer } from "../models_characters/farmer";
import { App } from "../app";
import { PlayMode } from "../scenes/playmode";

export class GUIPlay {
    public gameGUI:AdvancedDynamicTexture;
    public farmerCountTextBlock:TextBlock;
    public totalGoldPerSecondTextBlock:TextBlock;
    public totalGoldTextBlock:TextBlock;

    private _scene:PlayMode;
    
    private _playScreenWrapper:Rectangle;
    private _textBlockFarmer:TextBlock
    private _textBlockGoldPerSecond:TextBlock
    
    constructor(scene:PlayMode) {
        this._scene = scene;
        
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
            this._scene.mathCycle.farmerCount = this._makeFarmer(this._scene.mathCycle.farmerCount);
            this._scene.mathCycle.totalGoldPerSecond = this._scene.mathCycle.farmerMultiplyer(this._scene.mathCycle.farmerCount);
            //update the display
            this.farmerCountTextBlock.text = `${this._scene.mathCycle.farmerCount}`;
            this.totalGoldPerSecondTextBlock.text = `${this._scene.mathCycle.totalGoldPerSecond}`
        });

        this.farmerCountTextBlock = new TextBlock('FarmerCount', `${this._scene.mathCycle.farmerCount}`);
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

        this.totalGoldPerSecondTextBlock = new TextBlock('TotalGoldPerSecond', `${this._scene.mathCycle.totalGoldPerSecond}`);
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
        
        this.totalGoldTextBlock = new TextBlock('TotalGold', `${this._scene.mathCycle.totalGold}`);
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

    }

    private _makeFarmer(currentCount:number) {

        new Farmer(currentCount.toLocaleString(), this._scene);

        return currentCount + 1;

    }
}