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

export const farmsUpgradeCallBack = (farms:StructureFarms) => {
    farms.upgradeState();
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