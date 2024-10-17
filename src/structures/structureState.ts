import { Vector3 } from "@babylonjs/core";
import { ProductsT, StructureCharactersT, StructureStateI, StructureStateObserverI } from "../../typings";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { DEBUGMODE, modelsDir } from "../utils/CONSTANTS";
import { Runner } from "../models_characters/runners";

export class StructureState implements StructureStateI {
    public name:string;
    protected _observers:StructureStateObserverI[];
    protected _scene:PlayMode;
    protected _character:StructureCharactersT | null;
    protected _animationPaths:Vector3[][];
    
    protected _createGoldAmount:number;
    protected _upgradeMax:number;
    protected _upgradeCostFarmers:number | null;
    protected _upgradeCostGold:number;
    protected _product: ProductsT | null;
    protected _timeToMakeProduct:number | null;
    protected _upgradeLevel:number;
    protected _structureModels: StructureModel;
    
    //mathFunctions:StructureMathFunctionsT, _upgradeMax:number, _product:ProductsT | null, models:string[], clickBox:string, position:Vector3, character:StructureCharactersT | null, animationPaths:Vector3[][] | null

    constructor(name:string, scene:PlayMode) {
        this._observers = [];
        // this = mathFunctions;
        // this._character = character;
        // this._animationPaths = animationPaths;
        // this._upgradeMax = _upgradeMax;
        // this._upgradeLevel = 0;
        // this._upgradeCostGold = Math.round(this.upgradeCostOfGold(this._upgradeLevel)*1000)/1000;
        
        // if (this._upgradeCostFarmers) {
        //     this._upgradeCostFarmers = Math.round(this.upgradeCostFarmers(this._upgradeLevel));
        // } else {
        //     this._upgradeCostFarmers = 0;
        // }

        
        // if (this._timeToMakeProduct) {
        //     this._timeToMakeProduct = this.timeToMakeProduct(this._upgradeLevel);    
        // } else {
        //     this._timeToMakeProduct = 0;
        // }
        
        // this._product = _product
        
        // this._structureModels = new StructureModel(`${this.name}`, this._scene, models, clickBox, position);
    }

    //Observers
    public attach(observer: StructureStateObserverI): void {
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

    public detach(observer:StructureStateObserverI):void {
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

    // public upgradeState() {
        
    //     if (DEBUGMODE) {
    //         console.log(`${this.name} upgradeStateCalled`);
    //         console.log(`${this.name} currentUpgradeLevel: ${this._upgradeLevel}`);
    //     }
        
    //     if (this._upgradeLevel < this._upgradeMax) {
    //         //change the structures
    //         switch(this._upgradeLevel) {
    //             case 1 :  {
    //                 this._structureModels.hideModel(0);
    //                 this._structureModels.showModel(1);
    //             }
    //             break;
    //         }

    //         this._animateCharacters();
       
    //         //update the variables
    //         //these ones are before the notify
    //         this._upgradeLevel += 1;

    //         if (this.timeToMakeProduct) {
    //             this._timeToMakeProduct = this.timeToMakeProduct(this._upgradeLevel);
    //         }

    //         //update the observers
    //         this.notify();

    //         //these ones are after the notify
    //         if(this.upgradeCostFarmers) {
    //             this._upgradeCostFarmers = this.upgradeCostFarmers(this._upgradeLevel);
    //         }
    //         this._upgradeCostGold = Math.round(this.upgradeCostOfGold(this._upgradeLevel)*1000)/1000;

    //     }
    
    // }
    
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

            for(let i in this._scene.farms) {
                if (this._scene.farms[i].getUpgradeLevel() >= 1) {
                    usableFarms.push(this._scene.farms[i]);
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

    public getUpgradeCostFarmers(): number {
        return this._upgradeCostFarmers;
    }

    public getUpgradeCostGold(): number {
        return this._upgradeCostGold;    
    }

    public getUpgradeLevel(): number {
        return this._upgradeLevel;
    }

    public getProduct(): ProductsT {
        return this._product;
    }

    public getTimeToMakeProduct(): number {
        return this._timeToMakeProduct;
    }

    public getUpgradeMax(): number {
        return this._upgradeMax;
    }

    public getStructureModels(): StructureModel {
        return this._structureModels;
    }

    public getCreateGoldAmount():number {
        if (this._createGoldAmount == null) {
         
            return 0
        
        } else {
         
            return this._createGoldAmount;
        }
    }

}