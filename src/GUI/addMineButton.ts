import { Button, TextBlock } from"@babylonjs/gui";
import { GUIFONT1 } from "../utils/CONSTANTS";
import { UpgradeSection } from "./upgradeSection";
import { MineState } from "../gameControl/mineState";
import { GUIPlay } from "./GUIPlay";
import { mineUpgradeCostFarmers, mineUpgradeCostGold, oreUpgradeValue } from "../utils/MATHCONSTANTS";
import { Mine } from "../models_structures/mine";
import { MinePos } from "../utils/CONSTANTS";

export class ButtonAddMine extends Button {
    private _guiVertPosition:number;

    public available:boolean;
    public visible:boolean;

    private _costGold:number;
    private _costFarmers:number;

    private _text:TextBlock;
    private _costGoldText:TextBlock;
    private _costFarmersText:TextBlock;

    constructor(guiVertPosition:number, upgradeSection:UpgradeSection, mineState:MineState, gui:GUIPlay) {
        super('Button_Add_Mine');

        this._costGold = mineUpgradeCostGold(0);
        this._costFarmers = mineUpgradeCostFarmers(0);

        this._guiVertPosition = guiVertPosition;
        this.available = false;
        this.visible = false;

        this.top = this._guiVertPosition;
        this.background = 'Green';
        this.width = .95;
        this.height = .1;
        this.thickness = 0;
        this.left =0;

        this._text = new TextBlock('addMine', 'Add Mine');
        this._text.fontFamily = GUIFONT1;
        this._text.color = 'white';
        this._text.top = -20;
        this.addControl(this._text);

        this._costGoldText = new TextBlock('costInGold', `Cost Gold: ${this._costGold}`);
        this._costGoldText.fontFamily = GUIFONT1;
        this._costGoldText.color = 'white';
        
        this.addControl(this._costGoldText);

        this._costFarmersText = new TextBlock('costInFarmers', `Cost Famers: ${this._costFarmers}`);
        this._costFarmersText.fontFamily = GUIFONT1;
        this._costFarmersText.color = 'white';
        this._costFarmersText.top = 20;

        this.addControl(this._costFarmersText);

        this.onPointerDownObservable.add(() => {
            if (gui.totalGold > this._costGold && gui.totalFarmers > this._costFarmers) {

                //GUI
                //hide this button
                this.isVisible = false;

                //hide the GUI so we see the mine appear
                gui.GUIWrapperCastleUpgrade.isVisible = false;
                
                  //Scene
                //move the mine Into View
                const mine = gui.scene.getNodeByName('Mine') as Mine;
                mine.position.y = MinePos.y;

                //add the miners
                let count = gui.mineState.upgradeCostFarmers;
                console.log('number of Miners', count);

                const createMiners = () => {
                    count -= 1;

                    gui.makeMiner(count, 0);

                    if( count <= 1 ) {
                        clearInterval(intervalId);
                    }
                }
                
                const intervalId = setInterval(createMiners, 250);


                //apply the cost changes
                gui.totalFarmers = gui.totalFarmers - this._costFarmers;
                gui.totalGold =  gui.totalGold - this._costGold;
                
                //upgrade the state
                mineState.changeState();

                //update the GUI
                upgradeSection.goldCost = mineState.upgradeCostGold;
                upgradeSection.otherCost[1] = mineState.upgradeCostFarmers;
                console.log("cost of gold", mineState.upgradeCostGold);
            
                console.log(mine.getAbsolutePosition())
            }

        })

    }

}