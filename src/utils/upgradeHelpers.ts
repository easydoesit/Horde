import { Button, Rectangle } from "@babylonjs/gui";
import { StructureStateChildI } from "../../typings";
import { farmersMaxPerFarm } from "./CONSTANTS";
import { StandardUpgradeSection } from "../GUI/standardUpgrades/standardUpgradesSection";
import { StructureUpgradeSection } from "../GUI/structureUpgrades/structureUpgradeSection";
import { EpicUpgradeSection } from "../GUI/epicUpgrades/epicUpgradeSection";

export const makeButtonEnabled = (button:Button, upgradable:boolean, currentNumUpgrades:number ,maxNumUpgrades:number) => {

    if (upgradable === true && currentNumUpgrades < maxNumUpgrades) {
        button.isEnabled = true;
    } else {
        button.isEnabled = false;
    }

}

export const calcBarSegment = (currentSize:number, maxNumUpgrades:number) => {   
    const amountToAdd = 1 / maxNumUpgrades;
    const finalSize = currentSize + amountToAdd;

    return finalSize;
}

export const setSizeUpgradeBar = (section:StructureUpgradeSection| StandardUpgradeSection | EpicUpgradeSection,  level:number, maxNumUpgrades:number, upgradeBar:Rectangle):void =>{
    let newSize:number = 0
    
    if (level !== 0) {
        newSize = maxNumUpgrades/level/10;
    }
    
    console.log('newSize:', newSize);

    upgradeBar.width = newSize;

    if (newSize >= 1) {
        section.setUpgradeAble(false);
    }
      
}

export const cleanString = (string:string | number) => {
    const makeSizeString = string.toString(); 
    const cleanString = makeSizeString.replace(/\%/g, '');
    let finalNumber = parseFloat(cleanString);

    if (!finalNumber) {
        finalNumber = 0;
    }

   return finalNumber;
}

export const makeFloatDivideBy100 = (number:number) => {
    return number/100;
}

export  const checkUpgradeFarmersMax = (farm:StructureStateChildI) => {

    let total = null;

    if (farm.getUpgradeLevel() < farm.getUpgradeMax()) {
        total = Math.round(farmersMaxPerFarm(farm.getUpgradeLevel() + 1))
    } else {
        total = "Maxed out!";
    }

    return total;
}

export const structureUpgradeAllowed = (structure:StructureStateChildI) => {
    const mathState = structure.getScene().mathState;

    if (structure.getUpgradeLevel() < structure.getUpgradeMax()) {
        if (mathState.getTotalGold() > structure.getUpgradeCostGold() && mathState.getTotalFarmers() > structure.getUpgradeCostFarmers()) {
            return true;
        } else {
            return false;
        }
    }

}

export const addStructureFlow = (structure:StructureStateChildI, loadingSave:boolean) => {

    //move the _structure into view
    structure.moveStructuresToGamePosition();
    const structureModels = structure.getStructureModels();
    structureModels.showModel(0);

    //make structure alive
    structure.makeAlive();

    //do the scene animations here
    //dont do them for loadingSaves
    if (!loadingSave) {
        structure.animateCharacters();
        
        //pay for the structure
        const scene = structure.getScene();
        
        const mathState = scene.mathState;

        if (structure.getInitGoldCost()) {
            mathState.spendGold(structure.getInitGoldCost());
        }
        
        if (structure.getInitFarmerCost()) {
            mathState.spendFarmers(structure.getInitFarmerCost());
        }
        
        if (structure.getInitResourceCost()) {
            
            for (let i in scene.allStructures) {
                const structure = scene.allStructures[i];
            
                if (structure.getResourceName() === structure.getInitResourceName()) {
                    structure.removeResource(structure.getInitResourceCost());
                }

            }
        }
    
    }

}