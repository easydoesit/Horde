import { AdvancedDynamicTexture,  Button, Rectangle, Control, TextBlock} from "@babylonjs/gui";
import { Scene } from "@babylonjs/core";
import { GUIFONT1 } from "../utils/CONSTANTS";
import { farmerBaseValue, wheatValue, wheatValueMax } from "../utils/MATHCONSTANTS";

export class GUIPlayMode{
    public gameGUI:AdvancedDynamicTexture
    
    constructor(scene:Scene) {

        //starting from beggining of the game all numbers are 0.
        let farmerCount = 0
        let totalGoldPerSecond = 0;
        let totalGold = 0;
        let wheatImprovements = 0;

        this.gameGUI = AdvancedDynamicTexture.CreateFullscreenUI('GameGui')
        this.gameGUI.idealHeight = 1080;
        this.gameGUI.idealWidth = 1920;

        const rectWrapper = new Rectangle('wrappper');
        rectWrapper.width = 0.8;
        rectWrapper.thickness = 1;
        this.gameGUI.addControl(rectWrapper);
        
        //main clicker button
        const clickerBtn = Button.CreateSimpleButton("add", "Add");
        clickerBtn.fontFamily = GUIFONT1;
        clickerBtn.width = 0.2
        clickerBtn.height = "40px";
        clickerBtn.color = "white";
        clickerBtn.thickness = 2;
        clickerBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        
        rectWrapper.addControl(clickerBtn);

        clickerBtn.onPointerDownObservable.add(() => {
            //do the math
            farmerCount = this._makeFarmer(farmerCount);
            totalGoldPerSecond = this._farmerMultiplyer(farmerCount);
            //update the display
            farmerCountTextBlock.text = `${farmerCount}`;
            totalGoldPerSecondTextBlock.text = `${totalGoldPerSecond}`
        });

        const farmerCountTextBlock = new TextBlock('FarmerCount', `${farmerCount}`);
        farmerCountTextBlock.fontFamily = GUIFONT1;
        farmerCountTextBlock.width = 200;
        farmerCountTextBlock.top = -460;
        farmerCountTextBlock.left= -30;
        farmerCountTextBlock.color = 'white';
        rectWrapper.addControl(farmerCountTextBlock);
        
        //this should be replaced with an image
        const textBlockFarmer = new TextBlock('farmer', 'farmers');
        textBlockFarmer.fontFamily = GUIFONT1;
        textBlockFarmer.top = -460;
        textBlockFarmer.left= 30;
        textBlockFarmer.color = 'white';
        rectWrapper.addControl(textBlockFarmer);

        const totalGoldPerSecondTextBlock = new TextBlock('TotalGoldPerSecond', `${totalGoldPerSecond}`);
        totalGoldPerSecondTextBlock.fontFamily =GUIFONT1;
        totalGoldPerSecondTextBlock.width = 200;
        totalGoldPerSecondTextBlock.top = -440;
        totalGoldPerSecondTextBlock.left= -35;
        totalGoldPerSecondTextBlock.color = "white";
        rectWrapper.addControl(totalGoldPerSecondTextBlock);

        const textBlockGoldPerSecond = new TextBlock('GoldPerSecond', 'gold / second')
        textBlockGoldPerSecond.fontFamily = GUIFONT1;
        textBlockGoldPerSecond.top = -440;
        textBlockGoldPerSecond.left= 53;
        textBlockGoldPerSecond.color = 'white';
        rectWrapper.addControl(textBlockGoldPerSecond);    
        
        const totalGoldTextBlock = new TextBlock('TotalGold', `${totalGold}`);
        totalGoldTextBlock.fontFamily = GUIFONT1;
        totalGoldTextBlock.width = 200;
        totalGoldTextBlock.top = -420;
        totalGoldTextBlock.left= -35 ;
        totalGoldTextBlock.color = 'white';
        rectWrapper.addControl(totalGoldTextBlock);

        //this should be replace by an image
        const textBlockGold = new TextBlock('gold', 'Gold');
        textBlockGold.fontFamily = GUIFONT1;
        textBlockGold.top = -420;
        textBlockGold.left= 16;
        textBlockGold.color = 'white';
        rectWrapper.addControl(textBlockGold);  

        scene.onBeforeRenderObservable.add(() => {
            
            totalGold = totalGold + (totalGoldPerSecond * (scene.getEngine().getDeltaTime()/1000));
            
            let roundedTotalGold = Math.round(totalGold * 1000) / 1000;
            
            totalGoldTextBlock.text = `${roundedTotalGold}`;

        })
        

    }

    private _makeFarmer(currentCount:number) {

        return currentCount + 1;

    }

    private _farmerMultiplyer(farmerCount:number) {

        return Math.round((farmerCount * farmerBaseValue) * 1000) /1000;
    
    }

    private _wheatMultiplyer(numOfImprovements) {
        const totalRateOfImprovement = numOfImprovements * wheatValue;

    }

}