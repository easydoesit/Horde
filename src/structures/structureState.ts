import { Vector3 } from "@babylonjs/core";
import { ProductsT, StructureCharactersT, StructureNamesT, StructureStateI, StructureStateObserverOnUpgradeI, StructureStateObserverOnCycleI } from "../../typings";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE, modelsDir } from "../utils/CONSTANTS";
import { Runner } from "../models_characters/runners";
import { InSceneStuctureGUI } from "../GUI/inSceneStructureGUI";
import { UpgradeWindow } from "../GUI/upgradeWindow";
import { AddStructureButton } from "../GUI/structureUpgrades/addStructureButton";
import { StructureUpgradeSection } from "../GUI/structureUpgrades/structureUpgradeSection";

export class StructureState implements StructureStateI {
    protected _name:StructureNamesT;
    protected _observersOnUpgrade:StructureStateObserverOnUpgradeI[];
    protected _observersOnCycle:StructureStateObserverOnCycleI[]
    
    protected _scene:PlayMode;
    protected _character:StructureCharactersT | null;
    protected _animationPaths:Vector3[][];
    protected _structureModels: StructureModel;

    
    protected _inSceneGui:InSceneStuctureGUI;
    protected _upgradesWindow:UpgradeWindow;
    protected _upgradeSection:StructureUpgradeSection;
    protected _addStructureButton:AddStructureButton;

    protected _upgradeMax:number;
    protected _upgradeLevel:number;
    
    protected _upgradeCostGold:number;
    protected _upgradeCostFarmers:number | null;
    
    protected _product: ProductsT | null;
    protected _totalProductAmount:number;
    
    protected _cycleTime:number | null;
    protected _goldPerCycle:number;
    protected _productAmountPerCycle:number;
    

    constructor(scene:PlayMode) {
        this._scene = scene;
        this._observersOnUpgrade = [];
        this._observersOnCycle = [];
        this._totalProductAmount = 0;
        this._upgradeLevel = 0;
        this._cycleTime = 0;
        this._goldPerCycle = 0;
        this._productAmountPerCycle = 0;
    }

    //Observers
    public attachObserversUpgrade(observer: StructureStateObserverOnUpgradeI): void {
        const observerExists = this._observersOnUpgrade.includes(observer);

        if(observerExists) {
            if (DEBUGMODE) {
                return console.log(`${this.getName()} ${observer.name} has been attached already`);
            }
        }

        this._observersOnUpgrade.push(observer);
        
        if (DEBUGMODE) {
            console.log(`${this.getName()} attached ${observer.name}`);
        }
    }

    public detachObserversUpgrade(observer:StructureStateObserverOnUpgradeI):void {
        const observerIndex = this._observersOnUpgrade.indexOf(observer);

        if (observerIndex === -1) {
            if (DEBUGMODE) {
                return console.log(`No ${observer.name} on ${this.getName()}`);
            }
            return;
        }
        
        this._observersOnUpgrade.splice(observerIndex, 1);

        if (DEBUGMODE) {
            console.log(`Detached ${observer.name} from ${this.getName()}`);
        }
    }

    public notifyObserversOnUpgrade(): void {
        for(const observer of this._observersOnUpgrade) {
            observer.updateStructureOnUpgrade(this);
        }
        
    }

    public attachObserversCycle(observer: StructureStateObserverOnCycleI): void {
        const observerExists = this._observersOnCycle.includes(observer);

        if(observerExists) {
            if (DEBUGMODE) {
                return console.log(`${this.getName()} ${observer.name} has been attached already`);
            }
        }

        this._observersOnCycle.push(observer);
        
        if (DEBUGMODE) {
            console.log(`${this.getName()} attached ${observer.name}`);
        }
    }

    public detachObserversCycle(observer:StructureStateObserverOnCycleI):void {
        const observerIndex = this._observersOnCycle.indexOf(observer);

        if (observerIndex === -1) {
            if (DEBUGMODE) {
                return console.log(`No ${observer.name} on ${this.getName()}`);
            }
            return;
        }
        
        this._observersOnCycle.splice(observerIndex, 1);

        if (DEBUGMODE) {
            console.log(`Detached ${observer.name} from ${this.getName()}`);
        }
    }

    public notifyObserversOnCycle(): void {
  
        for(const observer of this._observersOnCycle) {
            observer.updateStructureOnCycle(this.getProductName(), this.getTotalProductAmount(), this.getGoldPerCycle());
        }
  
    }
    
    protected _makeCharacter(currentCount:number, originalLocation:number, character:StructureCharactersT, paths:Vector3[][] ){
        
        const characterModel = character + '.glb'

        new Runner(character, currentCount, modelsDir, characterModel, this._scene, originalLocation, paths, null)
        
    }

    protected _animateCharacters() {
          //animate characters
          if(this._character) {
            let characterCount = this._upgradeCostFarmers;

            //get the farms that have been upgraded
            const usableFarms:StructureStateI[] = [];
    
            // for(let i in this._scene.farms) {
            //     if (this._scene.farms[i].getUpgradeLevel() >= 1) {
            //         usableFarms.push(this._scene.farms[i]);
            //     }
            // }
            

            const intervalAmount = (arraySize:number) => {
                return 240/arraySize;
            }

            if (characterCount >= 0) {
                let index = 0;
                let iterationCount = 0;
                
                let maxIterations  = Math.round(this._upgradeCostFarmers / usableFarms.length);
    
                const intervalId = setInterval(() => {

                this._makeCharacter(characterCount, index, this._character, this._animationPaths);
    
                index++;
    
                if(index >= usableFarms.length) {
                    index = 0;
                }
    
                iterationCount++;
                characterCount--;
            
    
                if(iterationCount >= maxIterations || characterCount <=0) {
                    clearInterval(intervalId);
                }
                }, intervalAmount(usableFarms.length));
            }
        
        }
    }

    public getName(): StructureNamesT {
        return this._name;
    }

    public getScene(): PlayMode {
        return this._scene;
    }

    public getUpgradeCostFarmers(): number {
        return this._upgradeCostFarmers;
    }

    public getUpgradeCostGold(): number {
        return this._upgradeCostGold;    
    }

    public getUpgradeLevel(): number {
        return this._upgradeLevel;
    }

    public getProductName(): ProductsT {
        return this._product;
    }

    public addProduct(amount: number): void {
        this._totalProductAmount += amount;
    }

    public removeProduct(amount: number): void {
        this._totalProductAmount -= amount;
    }

    public getTotalProductAmount(): number {
        return this._totalProductAmount;
    }

    public getProductPerCycle(): number {
        return this._productAmountPerCycle;
    }

    public changeProductPerCycle(newValue: number): void {
        this._productAmountPerCycle = newValue;
    }

    public getProductCycleTime(): number {
        return this._cycleTime;
    }

    public changeProductCycleTime(newTime: number): void {
        this._cycleTime = newTime;
    }

    public getUpgradeMax(): number {
        return this._upgradeMax;
    }

    public getStructureModels(): StructureModel {
        return this._structureModels;
    }

    public getGoldPerCycle():number {
        if (this._goldPerCycle == null) {
         
            return 0
        
        } else {
         
            return this._goldPerCycle;
        }
    }

    public changeGoldPerCycle(amount:number) {
        this._goldPerCycle = amount;
    }

    public getInSceneGui(): InSceneStuctureGUI {
        return this._inSceneGui;
    }

    public getUpgradesWindow(): UpgradeWindow {
        return this._upgradesWindow;
    }

    public getUpgradeSection(): StructureUpgradeSection {
        return this._upgradeSection;
    }

    public getAddStructureButton(): AddStructureButton {
        return this._addStructureButton;
    }

    protected _addUpgradePanel():void {
        this.getUpgradesWindow().getPanelContainer().addControl(this.getUpgradeSection());
    }
}