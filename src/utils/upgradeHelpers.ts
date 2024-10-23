import { Button } from "@babylonjs/gui";
import { StructureStateChildI } from "../../typings";
import { farmersMaxPerFarm } from "./MATHCONSTANTS";
import { FarmUpgradeWindow } from "../GUI/farmUpgrades/farmUpgradeWindow";

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

export const farmUpgradeCallBack = (farm:StructureStateChildI) => {
    console.log('farmUpgradeCost', farm.getUpgradeCostGold());
    farm.upgradeState();

    farm.getUpgradeSection().changeGoldCost(farm.getUpgradeCostGold());
    (farm.getUpgradesWindow() as FarmUpgradeWindow).changeFarmersMaxText(`Max Farmers: ${farm.getScene().mathState.getFarmersMax()}`);

}

export const farmUpgradeAllowed = (farm:StructureStateChildI) => {
    
    if (farm.getUpgradeLevel() < farm.getUpgradeMax()) {

        if (farm.getScene().mathState.getTotalGold() >= farm.getUpgradeCostGold()) {
            return true;
        } else {
            return false;
        }
    }
}

export const  farmAdditionCallback = (thisFarm:StructureStateChildI, nextButton:Button) => {
    //show the upgrade section for this farm
    thisFarm.getUpgradeSection().isVisible = true;

    //make the next add Farm Button Available
    if(nextButton !== null) {
        nextButton.isVisible = true;
    }

    //hide the current add button
    thisFarm.getAddStructureButton().isVisible = false;

    //update the GUI
    for (let i = 0; i < thisFarm.getScene().farms.length; i++) {
        
        const text = (index:number) => {
            switch(index) {
                case 0: {
                    return '1st';
                }
            
                case 1: {
                    return '2nd';
                }

                case 2: {
                    return '3rd';
                }

                case 3: {
                    return '4th'
                }
        }}

        const otherFarm = thisFarm.getScene().farms[i];

        otherFarm.getUpgradeSection().instruction = `next Upgrade allows ${checkUpgradeFarmersMax(otherFarm)} farmers on your ${text(i)} farm`
        otherFarm.getUpgradeSection().textBlockUpgradeInstruction.text = otherFarm.getUpgradeSection().instruction;
    }

    (thisFarm.getUpgradesWindow() as FarmUpgradeWindow).changeFarmersMaxText(`Max Farmers: ${thisFarm.getScene().mathState.getFarmersMax()}`);

}

export const farmAdditionAllowed = (farm:StructureStateChildI) => {
    if (farm.getAddStructureButton().isVisible && farm.getScene().mathState.getTotalGold() >= farm.getUpgradeCostGold()) {
        farm.getAddStructureButton().isEnabled = true;
    } else {
        farm.getAddStructureButton().isEnabled = false;
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