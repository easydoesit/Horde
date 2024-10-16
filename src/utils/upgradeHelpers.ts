import { AdvancedDynamicTexture, Button, Rectangle, TextBlock, Control} from "@babylonjs/gui";

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
