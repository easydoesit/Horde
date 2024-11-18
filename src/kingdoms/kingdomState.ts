import { Vector3 } from "@babylonjs/core";
import { CastleUpgradeWindowI, KingdomI, KingdomStateI, KingdomStateObserverI  } from "../../typings";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE } from "../utils/CONSTANTS";
import { KingdomForest } from "./kingdomForest";
import { KingdomPlains} from "./kingdomPlains";
import { KingdomTundra } from "./kingdomTundra";
import { GUIPlay } from "../GUI/GUIPlay";
import { KingdomSwamp } from "./kingdomSwamp";
import { KingdomMountains } from "./kingdomMountains";
import { KingdomCoast } from "./kingomCoast";
import { KingdomOasis } from "./kingdomOasis";
import { KingdomTropical } from "./kingdomTropical";
import { KingdomWaterfall } from "./kingdomWaterfall";
import { KingdomSky } from "./kingdomSky";
import { KingdomMoon } from "./kingdomMoon";
import {KingdomInterDimensional} from './kingdomInterDimensional'

export class KingdomState implements KingdomStateI {
    private _name:string;
    private _scene:PlayMode;
    private _currentKingdom:KingdomI;
    private _nextKingdom:KingdomI | null;
    private _allKingdoms:KingdomI[];
    private _observers:KingdomStateObserverI[];

    private _kingdomPlains:KingdomPlains;
    private _kingdomForest:KingdomForest;
    private _kingdomTundra:KingdomTundra;
    private _kingdomSwamp:KingdomSwamp;
    private _kingdomMountains:KingdomMountains;
    private _kingdomCoast:KingdomCoast;
    private _kingdomOasis:KingdomOasis;
    private _kingdomTropical:KingdomTropical;
    private _kingdomWaterfall:KingdomWaterfall;
    private _kingdomSky:KingdomSky;
    private _kingdomMoon:KingdomMoon;
    private _kingdomInterDimensional:KingdomInterDimensional;

    constructor(name:string, scene:PlayMode) {
        this._name = name;
        this._scene = scene;
        this._allKingdoms = [];
        this._kingdomPlains = new KingdomPlains(this.getScene());
        this._kingdomForest = new KingdomForest(this.getScene());
        this._kingdomTundra = new KingdomTundra(this.getScene());
        this._kingdomSwamp = new KingdomSwamp(this.getScene());
        this._kingdomMountains = new KingdomMountains(this.getScene());
        this._kingdomCoast = new KingdomCoast(this.getScene());
        this._kingdomOasis = new KingdomOasis(this.getScene());
        this._kingdomTropical = new KingdomTropical(this.getScene());
        this._kingdomWaterfall = new KingdomWaterfall(this.getScene());
        this._kingdomSky = new KingdomSky(this.getScene());
        this._kingdomMoon = new KingdomMoon(this.getScene());
        this._kingdomInterDimensional = new KingdomInterDimensional(this.getScene());

        this._allKingdoms.push(
            this._kingdomPlains, 
            this._kingdomForest, 
            this._kingdomTundra,
            this._kingdomSwamp,
            this._kingdomMountains,
            this._kingdomCoast,
            this._kingdomOasis,
            this._kingdomTropical,
            this._kingdomWaterfall,
            this._kingdomSky,
            this._kingdomMoon,
            this._kingdomInterDimensional
        );

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

        //reset all the structures to level 0
        for (let i in this.getScene().allStructures) {
            const structure = this.getScene().allStructures[i];            
            const oldResourceMult = structure.getResourceMultiplyer();

            structure.kingdomReset();
            
            //add the kingdom boost to the resource multiplyer.
            const newResourceMult = oldResourceMult + (oldResourceMult * this.getCurrentKingdom().getBaseResourceBoost());
            structure.setResourceMultiplyer(newResourceMult); 
        }

        //make it so the structures can be added to the new kingdom.
        const gui = this.getScene().getAppGui() as GUIPlay
        const castleUpgadeWindow = gui.castleUpgradeWindow as unknown as CastleUpgradeWindowI

        for (let i in castleUpgadeWindow.getStructureButtons()) {
            const button =  castleUpgadeWindow.getStructureButtons()[i].button;
            if (!button.isVisible) {
                button.isVisible = true;
            }
        }

        //reset all standard upgrades to level 0
        for (let i in this.getScene().allStandardardUpgrades) {
            const upgrade = this.getScene().allStandardardUpgrades[i];

            upgrade.kingdomReset();

        }

        //any epic modifiers now need to be added back to the game.
        for (let i in this.getScene().allEpicUpgrades) {
            const upgrade = this.getScene().allEpicUpgrades[i];

            if (upgrade.getActive) {
                //run upgrade
                upgrade.kingdomUpdate();

            }

        } 

        //reset the mathstate. 
        //This should be done last as the kingdom and epic modifiers will change how the math is updated.
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
        for (let i=0; i <= this._allKingdoms.length - 1; i++) {
            
            const kingdom = this._allKingdoms[i];
            
            if (kingdom.getLevel() === this._currentKingdom.getLevel() + 1) {
                this._nextKingdom = kingdom;
                return;
            } else if(kingdom.getLevel() !== this._currentKingdom.getLevel()+ 1 && i === this._allKingdoms.length - 1){
                this._nextKingdom = null;
                return;
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