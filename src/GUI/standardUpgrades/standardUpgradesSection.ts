import { Button, Rectangle, TextBlock, Control } from "@babylonjs/gui";
import { DEBUGMODE, GUIFONT1 } from "../../utils/CONSTANTS";
import { StandardUpgradeStateChildI, StandardUpgradeStateI, StandardUpgradeStateObserverI} from "../../../typings";
import { calcBarSegment, cleanString, makeFloatDivideBy100 } from "../../utils/upgradeHelpers";
import { PlayMode } from "../../scenes/playmode";

export class StandardUpgradeSection extends Rectangle implements StandardUpgradeStateObserverI{
    public name:string;

    private _scene:PlayMode;
    private _instructions:string;
    private _maxNumUpgrades:number;
    private _upgradeAble:boolean;

    private _goldCost:number;
    private _farmerCost:number;
    private _resourceCost:number;
  
    private _tBTitle:TextBlock;
    private _tBInstruction:TextBlock;
    
    private _upgradeBtn:Button;
    
    private _btnRectGold:Rectangle;
    private _tBCostGold:TextBlock;
    private _tBGold:TextBlock;

    private _btnRectFarmers:Rectangle;
    private _tBCostFarmers:TextBlock;
    private _tBFarmers:TextBlock;

    private _btnRectResources:Rectangle;
    private _tBCostResources:TextBlock;
    private _tBResources:TextBlock;
    
    private _upgradeBarWrapper:Rectangle;
    private _upgradeBar:Rectangle;

    constructor(name:string, upgrade:StandardUpgradeStateChildI, callback:(...args:any[])=>any | null ) {
        super(name);
        this._upgradeAble = false;
        this._maxNumUpgrades = upgrade.getMaxNumUpgrades();
        this._scene = upgrade.getStructure().getScene();
        this._goldCost = upgrade.getCostToUpgradeGold();
        this._farmerCost = upgrade.getCostToUpgradeFarmers();
        this._resourceCost = upgrade.getCostToUpgradeResources();
        this._instructions = upgrade.getInstructions();
        
        upgrade.attach(this);

        this.width = .95;
        this.height = "125px";
        this.background = 'blue';
        this.color = 'white';
        this.thickness = 0;
        this.paddingBottom = '6px'
        this.paddingTop = '6px'

        this._tBTitle = new TextBlock(this.name, this.name);
        this._tBTitle.fontFamily = GUIFONT1;
        this._tBTitle.color = 'white';
        this._tBTitle.top = -35;
        this.addControl(this._tBTitle);

        this._tBInstruction = new TextBlock(`${this.name} instructions`, this._instructions);
        this._tBInstruction.fontFamily = GUIFONT1;
        this._tBInstruction.color = 'white';
        this._tBInstruction.top = -15;
        this.addControl(this._tBInstruction);

        this._upgradeBtn = Button.CreateSimpleButton('upgradeButton', 'Upgrade');
        this._upgradeBtn.textBlock.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this._upgradeBtn.textBlock.height = .2;
        this._upgradeBtn.textBlock.top = 10;
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
            if (DEBUGMODE) {
                console.log(`Standard Upgrade ${this.name} button pressed.`);
            }

            if (this.getUpgradeableStatus()) {
                const cleanedString = cleanString(this._upgradeBar.width);
                const sizeAsFloat = makeFloatDivideBy100(cleanedString);

                if(sizeAsFloat < 1) {
                    const newSize = calcBarSegment(sizeAsFloat, this.getMaxNumUpgrades());
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

        this._btnRectGold = new Rectangle('GoldRect');
        this._btnRectGold.height = .2;
        this._btnRectGold.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this._btnRectGold.width = 1;
        this._btnRectGold.thickness = 0;
        this._btnRectGold.top = 35;
        this._upgradeBtn.addControl(this._btnRectGold);

        this._tBCostGold = new TextBlock(`${this.name} cost in Gold`, `${this.getGoldCost()}`);
        this._tBCostGold.fontFamily = GUIFONT1;
        this._tBCostGold.color = 'gold';
        this._tBCostGold.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this._tBCostGold.width = .8;
        this._tBCostGold.left = 10
        this._btnRectGold.addControl(this._tBCostGold);
       
        
        this._tBGold = new TextBlock(`${this.name} Gold`, 'g:');
        this._tBGold.fontFamily = GUIFONT1;
        this._tBGold.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this._tBGold.color = 'gold';
        this._tBGold.width = .2;
        this._tBGold.left = 10
        this._btnRectGold.addControl(this._tBGold);

        if (this._farmerCost > 0) {
            this._btnRectFarmers = new Rectangle('FarmerRect');
            this._btnRectFarmers.height = .2;
            this._btnRectFarmers.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
            this._btnRectFarmers.width = 1;
            this._btnRectFarmers.thickness = 0;
            this._btnRectFarmers.top = 60;
            this._upgradeBtn.addControl(this._btnRectFarmers);

            this._tBCostFarmers = new TextBlock(`${this.name} cost in Farmers`, `${this.getFarmerCost()}`);
            this._tBCostFarmers.fontFamily = GUIFONT1;
            this._tBCostFarmers.color = 'pink';
            this._tBCostFarmers.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
            this._tBCostFarmers.width = .8;
            this._tBCostFarmers.left = 10
            this._btnRectFarmers.addControl(this._tBCostFarmers);
            
            this._tBFarmers = new TextBlock(`${this.name} Farmers`, 'f:');
            this._tBFarmers.fontFamily = GUIFONT1;
            this._tBFarmers.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            this._tBFarmers.color = 'pink';
            this._tBFarmers.width = .2;
            this._tBFarmers.left = 10
            this._btnRectFarmers.addControl(this._tBFarmers);        
        }

        if (this._resourceCost > 0) {
            this._btnRectResources = new Rectangle('ResourceRect');
            this._btnRectResources.height = .2;
            this._btnRectResources.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
            this._btnRectResources.width = 1;
            this._btnRectResources.thickness = 0;
            this._btnRectResources.top = 85;
            this._upgradeBtn.addControl(this._btnRectResources);

            this._tBCostResources = new TextBlock(`${this.name} cost in Resources`, `${this.getResourceCost()}`);
            this._tBCostResources.fontFamily = GUIFONT1;
            this._tBCostResources.color = 'orange';
            this._tBCostResources.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
            this._tBCostResources.width = .8;
            this._tBCostResources.left = 10
            this._btnRectResources.addControl(this._tBCostResources);
            
            this._tBResources = new TextBlock(`${this.name} Resources`, 'r:');
            this._tBResources.fontFamily = GUIFONT1;
            this._tBResources.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            this._tBResources.color = 'orange';
            this._tBResources.width = .2;
            this._tBResources.left = 10
            this._btnRectResources.addControl(this._tBResources);
        }
        
        this._upgradeBarWrapper = new Rectangle('upgradeBarWrapper');
        this._upgradeBarWrapper.background = 'lightblue';
        this._upgradeBarWrapper.height = .2;
        this._upgradeBarWrapper.width = .9;
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

        this._scene.onBeforeRenderObservable.add(() => {
            this._makeButtonEnabled();

        });
    }

    private _makeButtonEnabled() {
        
        if (this.getUpgradeableStatus()) {
            this._upgradeBtn.isEnabled = true;
        } else {
            this._upgradeBtn.isEnabled = false;
        }
    }

    public setUpgradableStatus(status:boolean) {
        this._upgradeAble = status;
    }

    private getUpgradeableStatus() {
        return this._upgradeAble;
    }

    private getGoldCost():number {
        return this._goldCost
    }

    private setGoldCost(amount:number):void {
        this._goldCost = amount;
    }

    private getFarmerCost():number {
        return this._farmerCost
    }

    private setFarmerCost(amount:number):void {
        this._farmerCost = amount;
    }

    private getResourceCost():number {
        return this._resourceCost;
    }

    private setResourceCost(amount:number):void {
        this._resourceCost = amount;
    }

    private getMaxNumUpgrades():number {
        return this._maxNumUpgrades;
    }

    public setMaxNumUpgrades(newMax:number):void {
        this._maxNumUpgrades = newMax;
    }

    private getInstructions():string {
        return this._instructions
    } 

    private setInstructions(newText:string) {
        this._instructions = newText;
        this._tBInstruction.text = this._instructions;
    }

    public updateStandardUpgrade(upgradeState: StandardUpgradeStateI): void {
        if (DEBUGMODE) {
            console.log(`${this.name} upgrade section as observer is updated from ${upgradeState.name}.`);
        }
        
        
        this.setMaxNumUpgrades(upgradeState.getMaxNumUpgrades());
        this.setInstructions(upgradeState.getInstructions());
        
        if (this._tBCostGold) {
            this.setGoldCost(upgradeState.getCostToUpgradeGold());
            this._tBCostGold.text = Math.round(this.getGoldCost()).toString();
        }
        
        if (this._tBCostFarmers) {
            this.setFarmerCost(upgradeState.getCostToUpgradeFarmers());
            this._tBCostFarmers.text = Math.round(this.getFarmerCost()).toString();
        }

        if (this._tBCostResources) {
            this.setResourceCost(upgradeState.getCostToUpgradeResources());
            this._tBCostResources.text = Math.round(this.getResourceCost()).toString();
        }
    }

}