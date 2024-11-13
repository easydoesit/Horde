import { Button } from "@babylonjs/gui";
import { StructureStateChildI } from "../../typings";
import { farmersMaxPerFarm } from "./CONSTANTS";
import { farmsT, StructureFarms } from "../structures/structureFarms";

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

export const farmsUpgradeCallBack = (farm:farmsT, farms:StructureFarms) => {
    farms.upgradeState();

    farm.upgradeLevel += 1;

    //change models
    if (farm.upgradeLevel < farm.upgradeMax) {
        //change the structures
        switch(farm.upgradeLevel) {

            case 1 :  {
                farm.models.hideModel(0);
                farm.models.showModel(1);
            }
            break;
            default: {
                console.error(`No models for ${farm.name} at Level ${farm.upgradeLevel}. Get the Art Team to work`);
            }
            break;
        }
        
    }
}

export const farmModelsReset = (farm:farmsT) => {
    for (let i = 1; i <= farm.models.models.length -1; i++) {
        farm.models.hideModel(i);
    }
    farm.models.showModel(0);

}

export const farmUpgradeAllowed = (farms:StructureStateChildI) => {
    
    if (farms.getUpgradeLevel() < farms.getUpgradeMax()) {

        if (farms.getScene().mathState.getTotalGold() >= farms.getUpgradeCostGold()) {
            return true;
        } else {
            return false;
        }
    }
}

export const farmAdditionAllowed = (farm:farmsT, farms:StructureStateChildI) => {
    
    if (farm.addStructureButton.isVisible && farms.getScene().mathState.getTotalGold() >= farms.getUpgradeCostGold()) {
        farm.addStructureButton.isEnabled = true;
    } else {
        farm.addStructureButton.isEnabled = false;
    }
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