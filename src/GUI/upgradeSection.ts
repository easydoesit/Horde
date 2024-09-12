import { AdvancedDynamicTexture, Button, Rectangle, TextBlock, Control} from "@babylonjs/gui";
import { GUIFONT1 } from "../utils/CONSTANTS";
import { GUIPlay } from "./GUIPlay";
import { PlayMode } from "../scenes/playmode";


export class UpgradeSection {
    public wrapperUpgradeContainer:Rectangle;
    private _textBlockUpgradeTitle:TextBlock;
    public textBlockUpgradeInstruction:TextBlock;
    private _upgradeBarWrapper:Rectangle;
    private _upgradeBtn:Button;
    private _upgradeBtnCostText:TextBlock;
    private _upgradeBar:Rectangle;

    private _name:string;
    public instruction:string;
    private _maxNumOfValues:number;
    private _higherContainer: Rectangle | AdvancedDynamicTexture;
    private _gui:GUIPlay;
    private _scene:PlayMode;
    private _guiVertPosition:number;
    public upgradeAble:boolean;
    
    public cost:number;

    constructor(name:string, instruction:string, initialCost:number, numberOfValues:number, higherContainer:Rectangle | AdvancedDynamicTexture, guiVertPosition:number, gui:GUIPlay, scene:PlayMode, callback:any) {
        this._name = name;
        this.instruction = instruction;
        this._maxNumOfValues = numberOfValues;
        this._higherContainer = higherContainer;
        this._guiVertPosition = guiVertPosition;  
        this._gui = gui;
        this.cost = initialCost;
        this._scene = scene;
        this.upgradeAble = false;

        this.wrapperUpgradeContainer = new Rectangle('wrapperUpgradeBar');
        this.wrapperUpgradeContainer.width = .95;
        this.wrapperUpgradeContainer.height = .1;
        this.wrapperUpgradeContainer.background = 'blue';
        this.wrapperUpgradeContainer.color = 'white';
        this.wrapperUpgradeContainer.thickness = 0;
        this.wrapperUpgradeContainer.top = this._guiVertPosition;
        this._higherContainer.addControl(this.wrapperUpgradeContainer);

        this._textBlockUpgradeTitle = new TextBlock(this._name, this._name);
        this._textBlockUpgradeTitle.fontFamily = GUIFONT1;
        this._textBlockUpgradeTitle.color = 'white';
        this._textBlockUpgradeTitle.top = -35;
        this.wrapperUpgradeContainer.addControl(this._textBlockUpgradeTitle);

        this.textBlockUpgradeInstruction = new TextBlock(this.instruction, this.instruction);
        this.textBlockUpgradeInstruction.fontFamily = GUIFONT1;
        this.textBlockUpgradeInstruction.color = 'white';
        this.textBlockUpgradeInstruction.top = -15;
        this.wrapperUpgradeContainer.addControl(this.textBlockUpgradeInstruction);

        this._upgradeBtn = Button.CreateSimpleButton('upgradeButton', `upgrade`);
        this._upgradeBtn.fontFamily = GUIFONT1;
        this._upgradeBtn.background = 'Green';
        this._upgradeBtn.width = .1;
        this._upgradeBtn.height = 1;
        this._upgradeBtn.thickness = 0;
        this._upgradeBtn.left = 0;
        this._upgradeBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this._upgradeBtn.isEnabled = false;

        this.wrapperUpgradeContainer.addControl(this._upgradeBtn);
        

        this._upgradeBtn.onPointerDownObservable.add(() => {
            //change the size of the upgrade bar
            const cleanString = this._cleanString(this._upgradeBar.width);
            const sizeAsFloat = this._makeFloatDivideBy100(cleanString);
            if (this.upgradeAble) {
                this._upgradeBtn.isEnabled = true;
                if (sizeAsFloat < 1) {
                    const newSize = this.calcBarSegment(sizeAsFloat, this._maxNumOfValues);
                    console.log(newSize);
                    this._upgradeBar.width = newSize;
                    
                    if (newSize >= 1) {
                        this._upgradeBtn.isEnabled = false;
                    }
                }
                
                if (callback) {
                    callback();
                }
            } 
        });

        this._upgradeBtnCostText = new TextBlock(`${this._name}_cost`, `${this.cost}g`);
        this._upgradeBtnCostText.fontFamily = GUIFONT1;
        this._upgradeBtnCostText.top = 20;
        this._upgradeBtn.addControl(this._upgradeBtnCostText);
        

        this._upgradeBarWrapper = new Rectangle('upgradeBarWrapper');
        this._upgradeBarWrapper.background = 'lightblue';
        this._upgradeBarWrapper.height = .2;
        this._upgradeBarWrapper.width = .88;
        this._upgradeBarWrapper.left = -55;
        this._upgradeBarWrapper.top = 20;
        this._upgradeBarWrapper.thickness = 0;
        this.wrapperUpgradeContainer.addControl(this._upgradeBarWrapper);

        this._upgradeBar = new Rectangle('upgradeBar');
        this._upgradeBar.background = 'green';
        this._upgradeBar.height = 1;
        this._upgradeBar.width = 0;
        this._upgradeBar.left = 0;
        this._upgradeBar.thickness = 0;
        this._upgradeBar.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this._upgradeBarWrapper.addControl(this._upgradeBar);

        //GameLoop
        this._scene.onBeforeRenderObservable.add(() => {
            
            this._upgradeBtnCostText.text = `${this.cost}g`;
            this._makeButtonEnabled();
        })

    }

    private calcBarSegment(currentSize:number, numberOfValues:number) {
        console.log('called');    
        const amountToAdd = 1 / this._maxNumOfValues;
        
        const finalSize = currentSize + amountToAdd;

        return finalSize;
    
    }

    private _cleanString(string:string | number) {
        const makeSizeString = string.toString(); 
        const cleanString = makeSizeString.replace(/\%/g, '');
        let finalNumber = parseFloat(cleanString);
    
        if (!finalNumber) {
            finalNumber = 0;
        }
    
       return finalNumber;
    }
    
    private _makeFloatDivideBy100(number:number) {
        return number/100;
    }

    private _makeButtonEnabled() {
        
        if (this.upgradeAble) {
            this._upgradeBtn.isEnabled = true;
        } else {
            this._upgradeBtn.isEnabled = false;
        }
    }
    

}