import { StructureI, StructureObserverI } from "../../typings";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE, smithyPos, smithyClickBox, smithyModels } from "../utils/CONSTANTS";
import { blackSmithUpgradeCostFarmers, blackSmithUpgradeCostGold, SmithyUpgradeMax, timeToMakeWeapon } from "../utils/MATHCONSTANTS";

export class Smithy implements StructureI {
    public name:string;
    private _observers:StructureObserverI[];
    private _scene:PlayMode;

    public upgradeCostFarmers:number;
    public upgradeCostGold:number;
    public timeToMakeWeapon:number;
    public upgradeLevel:number;
    public structureModels: StructureModel;

    constructor(name:string, scene:PlayMode) {
        this.name = name;
        this._scene = scene;
        this._observers = [];

        this.upgradeLevel = 0;
        this.upgradeCostGold = blackSmithUpgradeCostGold(this.upgradeLevel);
        this.upgradeCostFarmers = blackSmithUpgradeCostFarmers(this.upgradeLevel);
        this.timeToMakeWeapon = timeToMakeWeapon(this.upgradeLevel);

        this.structureModels = new StructureModel(`${this.name}`, this._scene, smithyModels, smithyClickBox, smithyPos);
    }

    //Observers
    public attach(observer: StructureObserverI): void {
        const observerExists = this._observers.includes(observer);

        if(observerExists) {
            if (DEBUGMODE) {
                return console.log(`${this.name} ${observer.name} has been attached already`);
            }
        }

        this._observers.push(observer);
        
        if (DEBUGMODE) {
            console.log(`${this.name} attached ${observer.name}`);
        }
    }

    public detach(observer:StructureObserverI):void {
        const observerIndex = this._observers.indexOf(observer);

        if (observerIndex === -1) {
            if (DEBUGMODE) {
                return console.log(`No ${observer.name} on ${this.name}`);
            }
            return;
        }
        
        this._observers.splice(observerIndex, 1);

        if (DEBUGMODE) {
            console.log(`Detached ${observer.name} from ${this.name}`);
        }
    }

    public notify(): void {
        for(const observer of this._observers) {
            observer.updateStructure(this);
        }
        
    }

    public upgradeState() {
        if (DEBUGMODE) {
            console.log(`${this.name} upgradeStateCalled`)
        }
        
        if (this.upgradeLevel < SmithyUpgradeMax) {
            //change the structures
        
            switch(this.upgradeLevel) {
                case 1 :  {
                    this.structureModels.hideModel(0);
                    this.structureModels.showModel(1);
                }
                break;
            }

            //update the variables
            this.upgradeLevel += 1;
            this.upgradeCostGold = blackSmithUpgradeCostGold(this.upgradeLevel);
            this.upgradeCostFarmers = blackSmithUpgradeCostFarmers(this.upgradeLevel);
            
            //update the observers;
            //use farmers - in observers;
            //update GUI - in observers;
            this.notify();

        }
    
    }

}