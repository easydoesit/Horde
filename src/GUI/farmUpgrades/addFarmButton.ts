import { Button, TextBlock, Control } from"@babylonjs/gui";
import { MathStateI } from "../../../typings";
import { farmsT, StructureFarms } from "../../structures/structureFarms";
import { GUIFONT1 } from "../../utils/CONSTANTS";
import { PlayMode } from "../../scenes/playmode";

export class AddFarmButton extends Button {
    private _mathState:MathStateI;
    private _scene:PlayMode;
    private _farms:StructureFarms;
    private _farm:farmsT;
    private _nextFarm:farmsT;

    public available:boolean;
    public visible:boolean;

    private _TitleText:TextBlock;
    private _costGoldText:TextBlock;


    constructor(name:string, farm:farmsT, nextFarm:farmsT | null, farms:StructureFarms, scene:PlayMode) {
        super(name);
        this._scene = scene;
        this._farm = farm;
        this._farms = farms;
        this._nextFarm = nextFarm;

        this.available = false;
        this.visible = false;

        this.background = 'Green';
        this.width = 1;
        this.height = '125px';
        this.paddingBottom = '3px';
        this.paddingTop = '3px';
        this.thickness = 0;

        this._TitleText = new TextBlock(`add${this.name}`, `Add ${this.name}`);
        this._TitleText.fontFamily = GUIFONT1;
        this._TitleText.color = 'white';
        this._TitleText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this._TitleText.height = '20px';
        this._TitleText.top = 10;
        this.addControl(this._TitleText);

        this._costGoldText = new TextBlock('costInGold', `Cost Gold: ${this._farms.getUpgradeCostGold().toFixed()}`);
        this._costGoldText.fontFamily = GUIFONT1;
        this._costGoldText.color = 'gold';
        this._costGoldText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this._costGoldText.height = '20px';
        this._costGoldText.top = 35;
        this.addControl(this._costGoldText);

        this.waitForScene();
    }

    private async waitForScene():Promise<void> {
        await this._scene.whenReadyAsync()
        .then(() => {
            this._mathState = this._scene.mathState;
            const farms = this._farms;

            this.onPointerDownObservable.add(() => {
                //since the player gets a farm at the beginning and all farms use the same
                //gold, adding a farm is more like an upgrade.
                if (this._mathState.getTotalGold() >= farms.getUpgradeCostGold()) {
                    this._addFarm(this._farm);
                }
            })
        })
    }

    private _addFarm(farm:farmsT) {
        //hide this button
        this.isVisible = false;

        //make farm alive
        this._farm.alive = true;

        //update the farms
        this._farms.upgradeState();

        //show the upgrade Section
        this._farm.upgradeSection.isVisible = true;

        //show the next AddFarm Button
        if(this._nextFarm) {
            this._nextFarm.addStructureButton.isVisible = true;
        }

        //move the farm into view
        const model = this._farm.models;
        model.position.y = this._farm.gamePos.y;
        model.showModel(0);

        //pay for the structure
        this._mathState.spendGold(this._farms.getUpgradeCostGold());

    }

    public setGoldCostText(newText:string):void {
        this._costGoldText.text = newText;
    }
}