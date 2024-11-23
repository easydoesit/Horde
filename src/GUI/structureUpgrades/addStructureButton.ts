import { Button, TextBlock, Control } from"@babylonjs/gui";
import { GUIFONT1 } from "../../utils/CONSTANTS";
import { MathStateI, StructureStateChildI } from "../../../typings";
import { StructureUpgradeSection } from "./structureUpgradeSection";
import { addStructureFlow } from "../../utils/upgradeHelpers";

export class AddStructureButton extends Button {
    private _mathState:MathStateI;
    private _structure:StructureStateChildI;

    public available:boolean;
    public visible:boolean;

    private _TitleText:TextBlock;
    private _costGoldText:TextBlock;
    private _costFarmersText:TextBlock;

    constructor(name:string, structure:StructureStateChildI, callback:(...args:any[]) => any ) {
        super(name);

        this._structure = structure;
        this.available = false;
        this.visible = false;

        this.background = 'Green';
        this.width = 1;
        this.height = '125px';
        this.paddingBottom = '3px';
        this.paddingTop = '3px';
        this.thickness = 0;

        this._TitleText = new TextBlock(`add${structure.getName()}`, `Add ${structure.getName()}`);
        this._TitleText.fontFamily = GUIFONT1;
        this._TitleText.color = 'white';
        this._TitleText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this._TitleText.height = '20px';
        this._TitleText.top = 10;
        this.addControl(this._TitleText);

        this._costGoldText = new TextBlock('costInGold', `Cost Gold: ${this._structure.getInitGoldCost()}`);
        this._costGoldText.fontFamily = GUIFONT1;
        this._costGoldText.color = 'gold';
        this._costGoldText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this._costGoldText.height = '20px';
        this._costGoldText.top = 35;
        this.addControl(this._costGoldText);

        if (this._structure.getInitFarmerCost()) {
            this._costFarmersText = new TextBlock('costInFarmers', `Cost Farmers: ${this._structure.getInitFarmerCost()}`);
            this._costFarmersText.fontFamily = GUIFONT1;
            this._costFarmersText.color = 'pink';
            this._costFarmersText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
            this._costFarmersText.height = '20px';
            this._costFarmersText.top = 60;

            this.addControl(this._costFarmersText);
        }

        if (this._structure.getInitResourceCost()) {
            this._costFarmersText = new TextBlock('costInFarmers', `Cost ${this._structure.getInitResourceName()}: ${this._structure.getInitResourceCost()}`);
            this._costFarmersText.fontFamily = GUIFONT1;
            this._costFarmersText.color = 'orange';
            this._costFarmersText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
            this._costFarmersText.height = '20px';
            this._costFarmersText.top = 85;

            this.addControl(this._costFarmersText);
        }

        this.waitForScene(callback);

    }

    private async waitForScene(callback:(...args:any[]) => any):Promise<void> {
        
        await this._structure.getScene().whenReadyAsync()
        .then(() => {
            this._mathState = this._structure.getScene().mathState;
  
            this.onPointerDownObservable.add(() => {
                const scene = this._structure.getScene();

                let enoughResourses = false;
                let enoughFarmers = false;
                let enoughGold = false;
                //check to see if there is enough resources

                if (this._structure.getInitResourceCost()) {
            
                    for (let i in scene.allStructures) {
                        const structure = scene.allStructures[i];
                    
                        if (structure.getResourceName() === this._structure.getInitResourceName()) {
                            if (structure.getTotalResourceAmount() >= this._structure.getInitResourceCost()) {
                                enoughResourses = true;
                            }
                        }
        
                    }
                } else {
                    enoughResourses = true;
                }
                console.log("enough Resources: ", enoughResourses);

                //check to see if there is enough farmers

                if (this._structure.getInitFarmerCost()) {
                    
                    if (this._mathState.getTotalFarmers() >= this._structure.getInitFarmerCost()) {
                        enoughFarmers = true;
                    }

                } else {
                    enoughFarmers = true;
                }
    
                console.log("enough Farmers: ", enoughFarmers);

                //check to see if there is enough gold

                if(this._mathState.getTotalGold() >= this._structure.getInitGoldCost()) {
                    enoughGold = true;
                }

                console.log("enough Gold: ", enoughGold);

                //if enough resources, farmers and gold proceed

                if(enoughResourses && enoughFarmers && enoughGold) {
                    this.isVisible = false;
                    addStructureFlow(this._structure, false);
                    
                    if (callback) {
                        callback();
                    }
                
                }
    
            });
            
        });
    }


    public kingdomReset():void {
        this.isVisible = true;
    }
}