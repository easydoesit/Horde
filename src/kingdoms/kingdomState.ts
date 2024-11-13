import { Vector3 } from "@babylonjs/core";
import { KingdomI, KingdomStateI, KingdomStateObserverI  } from "../../typings";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE } from "../utils/CONSTANTS";
import { KingdomForest } from "./kingdomForest";
import { KingdomPlains} from "./kingdomPlains";

export class KingdomState implements KingdomStateI {
    private _name:string;
    private _scene:PlayMode;
    private _currentKingdom:KingdomI;
    private _nextKingdom:KingdomI | null;
    private _allKingdoms:KingdomI[];
    private _observers:KingdomStateObserverI[];

    private _kingdomPlains:KingdomPlains;
    private _kingdomForest:KingdomForest;

    constructor(name:string, scene:PlayMode) {
        this._name = name;
        this._scene = scene;
        this._allKingdoms = [];
        this._kingdomPlains = new KingdomPlains(this.getScene());
        this._kingdomForest = new KingdomForest(this.getScene());

        this._allKingdoms.push(this._kingdomPlains, this._kingdomForest);

        this._currentKingdom = this._kingdomPlains;
        
        this.setNextKingdom();

        this._currentKingdom.setEnabled(false);
        this._observers = [];

    }

 
    public upgrade(): void {
        if (DEBUGMODE) {
            console.log('Kingdom Upgrade Called');
        }

        this.getCurrentKingdom().setEnabled(false);
        this.setCurrentingdom(this._nextKingdom);
        this.getCurrentKingdom().setEnabled(true);

        this.setNextKingdom();

        this._scene.mathState.spendGold(this.getCurrentKingdom().getCostToUnlockGold());
        const currentGoldMult = this.getScene().mathState.getGoldMultiplyer();
        const newGoldMultiplyer = currentGoldMult + (currentGoldMult * this.getCurrentKingdom().getBaseGoldBoost());
        this._scene.mathState.setGoldMultiplyer(newGoldMultiplyer);

        for (let i in this.getScene().allStructures) {
            const structure = this.getScene().allStructures[i];            
            const oldResourceMult = structure.getResourceMultiplyer();

            structure.kingdomReset();

            const newResourceMult = oldResourceMult + (oldResourceMult * this.getCurrentKingdom().getBaseResourceBoost());
            structure.setResourceMultiplyer(newResourceMult); 
        }

        this._scene.mathState.kingdomReset();
        this.notify();
    }

    //Observers
    public attach(observer:KingdomStateObserverI):void {
        const observerExists = this._observers.includes(observer);
        
        if(observerExists) {
            if (DEBUGMODE) {
                return console.log(`${this.getName()} ${observer.getName()} has been attached already`);
            }
        }
        
        this._observers.push(observer);
       
        if (DEBUGMODE) {
            console.log(`${this.getName()} attached ${observer.getName()}`);
        }

    }

    public detach(observer:KingdomStateObserverI) {
        const observerIndex = this._observers.indexOf(observer);

        if (observerIndex === -1) {
            if (DEBUGMODE) {
                return console.log(`No ${observer.getName()} on ${this.getName()}`);
            }
            return;
        }

        this._observers.splice(observerIndex, 1);

        if (DEBUGMODE) {
            console.log(`Detached ${observer.getName()} from ${this.getName()}`);
        }
    }

    public notify(): void {
        for(const observer of this._observers) {
            observer.onKingomStateUpgrade(this._currentKingdom);
        }
        
    }


    public getName(): string {
        return this._name
    }

    public getCurrentKingdom(): KingdomI {
        return this._currentKingdom
    }
    
    public setCurrentingdom(kingdom: KingdomI): void {
        this._currentKingdom.setEnabled(false);
        this._currentKingdom = kingdom;
        this._currentKingdom.setEnabled(true);
    }

    public getNextKingdom(): KingdomI {
        return this._nextKingdom;
    }

    public setNextKingdom(): void {
        console.log('set Next Kingdom Called');
        for (let i in this._allKingdoms) {
            const kingdom = this._allKingdoms[i];

            if (kingdom.getLevel() === this._currentKingdom.getLevel() + 1) {
                this._nextKingdom = kingdom;
            } else {
                this._nextKingdom = null;
            }
        };
    }

    public getAllKingdoms(): KingdomI[] {
        return this._allKingdoms;
    }

    public getScene(): PlayMode {
        return this._scene;
    }
}