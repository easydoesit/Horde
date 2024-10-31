import { Vector3 } from "@babylonjs/core";
import { ResourcesT, StructureCharactersT, StructureNamesT, StructureStateI, StructureStateObserverOnUpgradeI, StructureStateObserverOnCycleI } from "../../typings";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE, modelsDir } from "../utils/CONSTANTS";
import { Runner } from "../models_characters/runners";
import { InSceneStuctureGUI } from "../GUI/inSceneStructureGUI";
import { UpgradeWindow } from "../GUI/upgradeWindow";
import { AddStructureButton } from "../GUI/structureUpgrades/addStructureButton";
import { StructureUpgradeSection } from "../GUI/structureUpgrades/structureUpgradeSection";
import { AddStewardButton } from "../GUI/structureUpgrades/addStewardButtons";
import { farmsT } from "./structureFarms";

export class StructureState implements StructureStateI {
    protected _name:StructureNamesT;
    protected _alive:boolean;
    protected _observersOnUpgrade:StructureStateObserverOnUpgradeI[];
    protected _observersOnCycle:StructureStateObserverOnCycleI[]
    
    protected _scene:PlayMode;
    protected _character:StructureCharactersT | null;
    protected _animationPaths:Vector3[][];
    protected _structureModels: StructureModel;
    
    protected _inSceneGui:InSceneStuctureGUI;
    protected _upgradesWindow:UpgradeWindow;
    protected _upgradeSection:StructureUpgradeSection;
    protected _upgradeSectionInstructions:string;
    
    protected _steward:boolean;
    protected _stewardCost:number;
    protected _addStewartButton:AddStewardButton;
    
    protected _addStructureButton:AddStructureButton | null;

    protected _upgradeMax:number;
    protected _upgradeLevel:number;
    
    protected _upgradeCostGold:number;
    protected _upgradeCostFarmers:number | null;
    protected _upgradeCostResources:number | null;
    protected _initGoldCost:number;
    protected _initFarmerCost:number;
    protected _initResourceCost:number;
    protected _initResource:ResourcesT;
    
    protected _resource: ResourcesT | null;
    protected _totalResourceAmount:number;
    protected _resourceMultiplyer:number;
    protected _resourceUpgradeValue:number;
    
    protected _cycleTime:number | null;
    protected _goldPerCycle:number;
    protected _resourceAmountPerCycle:number;

    protected _goldMultiplyer:number;
    
    constructor(scene:PlayMode) {
        this._scene = scene;
        this._alive = false;
        this._observersOnUpgrade = [];
        this._observersOnCycle = [];
        this._totalResourceAmount = 0;
        this._upgradeLevel = 0;
        this._cycleTime = 0;
        this._goldPerCycle = 0;
        this._resourceAmountPerCycle = 0;
        this._goldMultiplyer = 1;
        this._resourceMultiplyer = 1;
        this._steward = false;

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
            console.log(`${this.getName()} attached ${observer.name} on Upgrade`);
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
            console.log(`${this.getName()} attached ${observer.name} on Cycle`);
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
            observer.updateStructureOnCycle(this.getResourceName(), this.getTotalResourceAmount(), this.getGoldPerCycle());
        }
  
    }
    
    protected _makeCharacter(currentCount:number, originalLocation:number, character:StructureCharactersT, paths:Vector3[][] ){
        
        const characterModel = character + '.glb'

        new Runner(character, currentCount, modelsDir, characterModel, this._scene, originalLocation, paths, null)
        
    }

    public animateCharacters() {
          //animate characters
          if(this._character) {
            let characterCount = 0;

            if (this.getUpgradeLevel() === 0) {
                characterCount = this.getInitFarmerCost();
            } else {
                characterCount = this.getUpgradeCostFarmers();
            }
            
            //get the farms that have been upgraded
            const usableFarms:farmsT[] = [];
    
            for(let i in this._scene.farms.getAllFarms()) {
                const farm = this._scene.farms.getAllFarms()[i];
                
                if (farm.alive === true) {
                    usableFarms.push(farm);
                }
            }
            

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
    setUpgradeCostGold(newCost: number): void {
        this._upgradeCostGold = newCost;
    }

    public getUpgradeCostResources():number {
        return this._upgradeCostResources;
    }

    public getUpgradeLevel(): number {
        return this._upgradeLevel;
    }

    public getNextUpgradeLevel(): number {
        return this._upgradeLevel + 1;
    }

    public getResourceName(): ResourcesT {
        return this._resource;
    }

    public addResource(amount: number): void {
        this._totalResourceAmount += amount;
    }

    public removeResource(amount: number): void {
        this._totalResourceAmount -= amount;
    }

    public getTotalResourceAmount(): number {
        return this._totalResourceAmount;
    }

    public getResourcePerCycle(): number {
        return this._resourceAmountPerCycle;
    }

    public changeResourcePerCycle(newValue: number): void {
        this._resourceAmountPerCycle = newValue;
    }

    public getResourceCycleTime(): number {
        return this._cycleTime;
    }

    public changeResourceCycleTime(newTime: number): void {
        this._cycleTime = newTime;
    }

    public getResourceMultiplyer(): number {
        return this._resourceMultiplyer;
    }

    public changeResourceMultiplyer(newValue: number): void {
        this._resourceMultiplyer = newValue;
    }

    public getResourceUpgradeValue(): number {
        return this._resourceUpgradeValue;
    }

    public changeResourceUpgradeValue(newValue: number): void {
        this._resourceUpgradeValue = newValue;
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

    public getGoldMultiplyer(): number {
        return this._goldMultiplyer;
    }

    public changeGoldMultiplyer(newValue: number): void {
        this._goldMultiplyer = newValue;
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

    public getAnimationPaths(): Vector3[][] {
        return this._animationPaths;
    }

    protected _addUpgradePanel():void {
        this.getUpgradesWindow().getPanelContainer().addControl(this.getUpgradeSection());
    }

    public moveStructuresToGamePosition():void{
        console.log(this.getStructureModels().position);
        console.log(this.getStructureModels().gamePosition);
        this.getStructureModels().position = this.getStructureModels().gamePosition;
    }

    protected _moveStructureToStartPosition():void {
        this.getStructureModels().position = this.getStructureModels().gamePosition;
        this.getStructureModels().position.y = this.getStructureModels().position.y -20;
    }

    public getUpgradeSectionInstructions(): string {
        return this._upgradeSectionInstructions;
    }

    public changeUpgradeSectionInstructions(newText:string): void {
        this._upgradeSectionInstructions = newText;
    }

    public getSteward(): boolean {
        return this._steward;
    }

    public changeSteward(state: boolean): void {
        this._steward = state;
    }

    public getStewardCost(): number {
        return this._stewardCost;
    }

    public getInitFarmerCost(): number {
        return this._initFarmerCost;
    }

    public getInitGoldCost(): number {
        return this._initGoldCost;
    }

    public getInitResourceCost(): number {
        return this._initResourceCost;
    }

    public getInitResourceName(): ResourcesT {
        return this._initResource;
    }

    public getAlive(): boolean {
        return this._alive;
    }

    public makeAlive(): void {
        this._alive = true;
    }
}