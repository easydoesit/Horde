import { GoldStateI, GoldStateObserverI } from "../../typings";
import { GUIPlay } from "../GUI/GUIPlay";
import { startingGold } from "../utils/MATHCONSTANTS";

export class GoldState implements GoldStateI {
    public totalGold: number;
    private _goldStateObservers:GoldStateObserverI[];
    
    private _gui:GUIPlay

    constructor(gui:GUIPlay) {
        this.totalGold = startingGold;
   
        this._gui = gui;
        this._goldStateObservers =[];

    }

    public attach(goldStateObserver:GoldStateObserverI):void {
        const observerExists = this._goldStateObservers.includes(goldStateObserver);
        
        if(observerExists) {
            return console.log(`GoldStateObserverI has been attached already`);

        }
        console.log('GameState Attached an Observer');
        this._goldStateObservers.push(goldStateObserver);

    }

    public detach(goldStateObserver:GoldStateObserverI) {
        const observerIndex = this._goldStateObservers.indexOf(goldStateObserver);

        if (observerIndex === -1) {
            return console.log('No Attached Observer');
        }

        this._goldStateObservers.splice(observerIndex, 1);
        console.log('Detached a GoldStateObserverI');
    }

    public notify(): void {
        for(const goldStateObserver of this._goldStateObservers) {
            goldStateObserver.updateGoldAttributes(this);
        }
        
    }

}