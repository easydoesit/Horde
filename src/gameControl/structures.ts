import { Vector3 } from "@babylonjs/core";
import { ProductsT, StructureCharactersT, StructureI, StructureMathFunctionsT, StructureObserverI } from "../../typings";
import { StructureModel } from "../models_structures/structureModels";
import { PlayMode } from "../scenes/playmode";
import { castleToFarmPaths, DEBUGMODE, farmToMinePaths, farmToSmithyPaths, modelsDir } from "../utils/CONSTANTS";
import { Runner } from "../models_characters/runners";

export class Structure implements StructureI {
    public name:string;
    private _observers:StructureObserverI[];
    private _scene:PlayMode;
    private _mathFunctions:StructureMathFunctionsT;
    private _character:StructureCharactersT | null;

    public upgradeMax:number;
    public upgradeCostFarmers:number | null;
    public upgradeCostGold:number;
    public product: ProductsT | null;
    public timeToMakeProduct:number | null;
    public upgradeLevel:number;
    public structureModels: StructureModel;
    
    constructor(name:string, scene:PlayMode, mathFunctions:StructureMathFunctionsT, upgradeMax:number, product:ProductsT | null, models:string[], clickBox:string, position:Vector3, character:StructureCharactersT | null) {
        this.name = name;
        this._scene = scene;
        this._observers = [];
        this._mathFunctions = mathFunctions;
        this._character = character;
        this.upgradeMax = upgradeMax;
        this.upgradeLevel = 0;
        this.upgradeCostGold = Math.round(this._mathFunctions.upgradeCostOfGold(this.upgradeLevel)*1000)/1000;
        
        if (this._mathFunctions.upgradeCostFarmers) {
            this.upgradeCostFarmers = Math.round(this._mathFunctions.upgradeCostFarmers(this.upgradeLevel));
        } else {
            this.upgradeCostFarmers = 0;
        }

        
        if (this._mathFunctions.timeToMakeProduct) {
            this.timeToMakeProduct = this._mathFunctions.timeToMakeProduct(this.upgradeLevel);    
        } else {
            this.timeToMakeProduct = 0;
        }
        
        this.product = product
        
        this.structureModels = new StructureModel(`${this.name}`, this._scene, models, clickBox, position);
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
            console.log(`${this.name} upgradeStateCalled`);
            console.log(`${this.name} currentUpgradeLevel: ${this.upgradeLevel}`);
        }
        
        if (this.upgradeLevel < this.upgradeMax) {
            //change the structures
            switch(this.upgradeLevel) {
                case 1 :  {
                    this.structureModels.hideModel(0);
                    this.structureModels.showModel(1);
                }
                break;
            }

            //animate characters
            if(this._character) {
                let characterCount = this.upgradeCostFarmers;

                //get the farms that have been upgraded
                const usableFarms:StructureI[] = [];

                for(let i in this._scene.farms) {
                    if (this._scene.farms[i].upgradeLevel >= 1) {
                        usableFarms.push(this._scene.farms[i]);
                    }
                }

                const intervalAmount = (arraySize:number) => {
                    return 240/arraySize;
                }

                if (characterCount >= 0) {
                    let index = 0;
                    let iterationCount = 0;
                    
                    let maxIterations  = Math.round(this.upgradeCostFarmers / usableFarms.length);
        
                    const intervalId = setInterval(() => {

                    this._makeCharacter(characterCount, index, this._character);
        
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

       
            //update the variables
            //these ones are before the notify
            this.upgradeLevel += 1;

            if (this._mathFunctions.timeToMakeProduct) {
                this.timeToMakeProduct = this._mathFunctions.timeToMakeProduct(this.upgradeLevel);
            }

            //update the observers
            this.notify();

            //these ones are after the notify
            if(this._mathFunctions.upgradeCostFarmers) {
                this.upgradeCostFarmers = this._mathFunctions.upgradeCostFarmers(this.upgradeLevel);
            }
            this.upgradeCostGold = Math.round(this._mathFunctions.upgradeCostOfGold(this.upgradeLevel)*1000)/1000;

        }
    
    }
    
    private _makeCharacter(currentCount:number, orignalLocation:number, character:StructureCharactersT){

        switch(character) {
            
            case 'miners' : {
                new Runner('miner', currentCount, modelsDir, 'miner.glb', this._scene, orignalLocation, farmToMinePaths, null);
            }
            break;

            case 'blacksmiths' : {
                new Runner('blacksmith', currentCount, modelsDir, 'blacksmith.glb', this._scene, orignalLocation, farmToSmithyPaths, null);
            }
        }
        
    }

}