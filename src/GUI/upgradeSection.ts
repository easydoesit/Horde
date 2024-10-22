import { AdvancedDynamicTexture, Button, Rectangle, TextBlock, Control, ScrollViewer, StackPanel} from "@babylonjs/gui";
import { GUIFONT1 } from "../utils/CONSTANTS";
import { PlayMode } from "../scenes/playmode";

export class UpgradeSection {
    public wrapperUpgradeContainer:Rectangle;
    private _textBlockUpgradeTitle:TextBlock;
    public textBlockUpgradeInstruction:TextBlock;
    private _upgradeBarWrapper:Rectangle;
    private _upgradeBtn:Button;
    private _upgradeBtnCostText01:TextBlock;
    private _upgradeBtnCostText02:TextBlock;
    private _upgradeBar:Rectangle;

    public name:string;
    public instruction:string;
    private _maxNumOfUpgrades:number;
    private _higherContainer: StackPanel;
    private _scene:PlayMode;
    //private _guiVertPosition:number;
    public upgradeAble:boolean;
    
    public goldCost:number;
    public otherCost:[name:string, cost:number];

    constructor(name:string, instruction:string, goldCost:number, otherCost:[name:string, cost:number] | null, maxNumberOfUpgrades:number, higherContainer:StackPanel, scene:PlayMode, callback:any) {
        this.name = name;
        this.instruction = instruction;
        this._maxNumOfUpgrades = maxNumberOfUpgrades;
        this._higherContainer = higherContainer;
        //this._guiVertPosition = guiVertPosition;  
        this.goldCost = goldCost;
        
        if (otherCost) {
            this.otherCost = otherCost;
        }
        
        this._scene = scene;
        this.upgradeAble = false;

        this.wrapperUpgradeContainer = new Rectangle('wrapperUpgradeBar');
        this.wrapperUpgradeContainer.width = .95;
        this.wrapperUpgradeContainer.height = .1;
        this.wrapperUpgradeContainer.background = 'blue';
        this.wrapperUpgradeContainer.color = 'white';
        this.wrapperUpgradeContainer.thickness = 0;
        //this.wrapperUpgradeContainer.top = this._guiVertPosition;
        this._higherContainer.addControl(this.wrapperUpgradeContainer);

        this._textBlockUpgradeTitle = new TextBlock(this.name, this.name);
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
                    const newSize = this.calcBarSegment(sizeAsFloat, this._maxNumOfUpgrades);
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

        this._upgradeBtnCostText01 = new TextBlock(`${this.name}_cost`, `${this.goldCost}g`);
        this._upgradeBtnCostText01.fontFamily = GUIFONT1;
        this._upgradeBtnCostText01.top = 20;
        this._upgradeBtn.addControl(this._upgradeBtnCostText01);

        if (this.otherCost) {
            this._upgradeBtnCostText02 = new TextBlock(`otherCost`, `+ ${this.otherCost[1]} ${this.otherCost[0]}`);
            this._upgradeBtnCostText02.fontFamily = GUIFONT1;
            this._upgradeBtnCostText02.top = 40;
            this._upgradeBtn.addControl(this._upgradeBtnCostText02);
        }

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
            
            this._upgradeBtnCostText01.text = `${this.goldCost}g`;
            if(this.otherCost) {
                this._upgradeBtnCostText02.text = `${this.otherCost[1]} ${this.otherCost[0]}`;
            }
            this._makeButtonEnabled();
        })

    }

    private calcBarSegment(currentSize:number, maxNumberOfUpgrades:number) {   
        const amountToAdd = 1 / this._maxNumOfUpgrades;
        
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