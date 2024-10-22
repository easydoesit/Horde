import { AdvancedDynamicTexture, Button, Rectangle, TextBlock, Control, ScrollViewer, StackPanel} from "@babylonjs/gui";
import { DEBUGMODE, GUIFONT1 } from "../../utils/CONSTANTS";
import { PlayMode } from "../../scenes/playmode";
import { makeButtonEnabled, calcBarSegment, cleanString, makeFloatDivideBy100 } from "../../utils/upgradeHelpers";
import { EpicUpgradeStateChildI, EpicUpgradeStateI, EpicUpgradeStateObserverI } from "../../../typings";

export class EpicUpgradeSection extends Rectangle implements EpicUpgradeStateObserverI {
    public name:string;
    private _costInLumens:number;
    private _maxNumUpgrades:number;
    private _scene:PlayMode;
    private _upgradable:boolean;
    private _upgrade:EpicUpgradeStateChildI;

    private _title:TextBlock;
    private _textBlockInstruction:TextBlock;
    private _upgradeBtn:Button;
    private _upgradeBtnCostText01:TextBlock;
    private _upgradeBtnCostText02:TextBlock;
    private _upgradeBarWrapper:Rectangle;
    private _upgradeBar:Rectangle;

    constructor(name:string, epicUpgrade:EpicUpgradeStateChildI, scene:PlayMode, callback:any ) {
        super(name + 'epicUpgradeSection');
        this._upgrade = epicUpgrade;
        this._upgrade.attach(this);
        this._costInLumens = this._upgrade.getCostToUpgrade();
        this._maxNumUpgrades = this._upgrade.getUpgradeNumMax();
        this._scene = scene;

        this.width = .95;
        this.height = '125px';
        this.background = 'blue';
        this.color = 'white';
        this.thickness = 0;
        this.paddingBottom = '6px';
        this.paddingTop = '6px'

        this._title = new TextBlock(this.name + 'title', name);
        this._title.fontFamily = GUIFONT1;
        this._title.color = 'white';
        this._title.top = -35;
        this.addControl(this._title);

        this._textBlockInstruction = new TextBlock(this.name + 'instructions', this._upgrade.getInstructions());
        this._textBlockInstruction.fontFamily = GUIFONT1;
        this._textBlockInstruction.color = 'white';
        this._textBlockInstruction.top = -15;
        this.addControl(this._textBlockInstruction);

        this._upgradeBtn = Button.CreateSimpleButton('upgradeButton', '');
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
                console.log(`Epic Upgrade ${this.name} called.`);
            }
            const cleanedString = cleanString(this._upgradeBar.width);
            const sizeAsFloat = makeFloatDivideBy100(cleanedString);
            

            if (this._upgradable) {
                
                //this._upgradeBtn.isEnabled = true;
                
                if(sizeAsFloat < 1) {
                    const newSize = calcBarSegment(sizeAsFloat, this._maxNumUpgrades);
                    this._upgradeBar.width = newSize;

                    if (newSize >= 1) {
                        this._upgradeBtn.isEnabled = false;
                    }

                }

                this._scene.mathState.spendLumens(this._costInLumens);
                this._upgrade.updateState();

                if (callback) {
                    callback();
                }

            }

        });

        this._upgradeBtnCostText01 = new TextBlock(`${this.name}_cost`, `costs`);
        this._upgradeBtnCostText01.fontFamily = GUIFONT1;
        this._upgradeBtnCostText01.top = -10;
        this._upgradeBtn.addControl(this._upgradeBtnCostText01);

        this._upgradeBtnCostText02 = new TextBlock(`lumens`, `${this._costInLumens} Lum`);
        this._upgradeBtnCostText02.fontFamily = GUIFONT1;
        this._upgradeBtnCostText02.top = 10;
        this._upgradeBtn.addControl(this._upgradeBtnCostText02);

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
            this._upgradeBtnCostText02.text = `${this._costInLumens} Lum`;
            
            this._affordableUpgrade();
            makeButtonEnabled(this._upgradeBtn, this._upgradable, this._upgrade.getCurrentUpgradeLevel(), this._upgrade.getUpgradeNumMax());
        })

    }

    private _affordableUpgrade() {
        
        if (this._scene.mathState.getTotalLumens() >= this._costInLumens) {
            
            this._upgradable = true;
        } else {
            this._upgradable = false;
        }
        
    }

    public updateEpicUpgrade(upgrade: EpicUpgradeStateI): void {
        console.log("the observer was called");

        this._costInLumens = upgrade.getCostToUpgrade();
        this._textBlockInstruction.text = upgrade.getInstructions();
    }

}