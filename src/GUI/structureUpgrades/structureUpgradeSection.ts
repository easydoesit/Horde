import { Button, Rectangle, TextBlock, Control } from "@babylonjs/gui";
import { farm01, GUIFONT1 } from "../../utils/CONSTANTS";
import { PlayMode } from "../../scenes/playmode";
import { StructureStateChildI } from "../../../typings";
import { StructureFarm01 } from "../../structures/structureFarm01";

export class StructureUpgradeSection extends Rectangle {
    private _textBlockTitle:TextBlock;
    private _textBlockInstruction:TextBlock;
    private _upgradeBarWrapper:Rectangle;
    private _upgradeBtn:Button;
    private _upgradeBtnCostText01:TextBlock;
    private _upgradeBtnCostText02:TextBlock;
    private _upgradeBar:Rectangle;

    private _structure:StructureStateChildI;
    public name:string;
    private _instruction:string;
    private _maxNumOfUpgrades:number;
    private _scene:PlayMode;
    public upgradeAble:boolean;
    
    private _goldCost:number;
    private _farmerCost:number;

    constructor(name:string, instruction:string, structure:StructureStateChildI, callback:(...args:any[])=>any | null) {
        super(name);
        this.name = name;
        this._instruction = instruction;
        this._structure = structure;
        this._maxNumOfUpgrades = this._structure.getUpgradeMax();
        this._goldCost = this._structure.getUpgradeCostGold();
        this._farmerCost = this._structure.getUpgradeCostFarmers();

        this._scene = structure.getScene();
        this.upgradeAble = false;

        this.width = .95;
        this.height = "125px";
        this.background = 'blue';
        this.color = 'white';
        this.thickness = 0;
        this.paddingBottom = '6px'
        this.paddingTop = '6px'

        this._textBlockTitle = new TextBlock(this.name, this.name);
        this._textBlockTitle.fontFamily = GUIFONT1;
        this._textBlockTitle.color = 'white';
        this._textBlockTitle.top = -35;
        this.addControl(this._textBlockTitle);

        this._textBlockInstruction = new TextBlock(this._instruction, this._instruction);
        this._textBlockInstruction.fontFamily = GUIFONT1;
        this._textBlockInstruction.color = 'white';
        this._textBlockInstruction.top = -15;
        this.addControl(this._textBlockInstruction);

        this._upgradeBtn = Button.CreateSimpleButton('upgradeButton', `upgrade`);
        this._upgradeBtn.fontFamily = GUIFONT1;
        this._upgradeBtn.background = 'Green';
        this._upgradeBtn.width = .1;
        this._upgradeBtn.height = 1;
        this._upgradeBtn.thickness = 0;
        this._upgradeBtn.left = 0;
        this._upgradeBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this._upgradeBtn.isEnabled = false;

        this.addControl(this._upgradeBtn);
        
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
                //anything you want to do to the state is in the callback
                if (callback) {
                    callback();
                }
            } 
        });

        this._upgradeBtnCostText01 = new TextBlock(`${this.name}_cost`, `${this._goldCost}g`);
        this._upgradeBtnCostText01.fontFamily = GUIFONT1;
        this._upgradeBtnCostText01.top = 20;
        this._upgradeBtn.addControl(this._upgradeBtnCostText01);

        if (this._farmerCost) {
            this._upgradeBtnCostText02 = new TextBlock(`farmer`, `+ ${this._farmerCost} farmers`);
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
        this.addControl(this._upgradeBarWrapper);

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
            
            this._upgradeBtnCostText01.text = `${this._goldCost}g`;
            if(this._farmerCost) {
                this._upgradeBtnCostText02.text = `${this._farmerCost} farmers`;
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

    public getGoldCost():number {
        return this._goldCost;
    }

    public changeGoldCost(amount:number):void {
        this._goldCost = amount;
    }

    public getFarmerCost():number {
        return this._farmerCost;
    }

    public changeFarmerCost(amount:number):void {
        this._farmerCost = amount;
    }

    public changeInstruction(text:string):void {
        this._instruction = text;
        this._textBlockInstruction.text = this._instruction;
    }

}