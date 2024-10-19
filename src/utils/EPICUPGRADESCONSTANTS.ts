//Increase Add Farmers Multiplyer

export const addFarmersStartValue = 1;
export const addFarmersNumUpgradeMax = 10;
export const addFarmersValueIncrement = 3;
export const addFarmersBaseCostLumens = 100;

export const addFarmersCostLumens = (currentUpgradeLevel:number, upgradeMax:number, baseCostLumens:number):number => {
    
    if (currentUpgradeLevel === 0 ) {
 
        return baseCostLumens;
 
    } else if (currentUpgradeLevel < upgradeMax){
 
        return (1.6 * currentUpgradeLevel) * baseCostLumens;
 
    }

}

export const addFarmersUpgradeInstructions = (upgradeLevel:number, increment:number):string => {
    let value = 0;
    if (upgradeLevel === 0) {
        value = 1
    } else {
        value = upgradeLevel * increment;
    }

    return `Current upgrade adds ${value} farmers per click`

}

//Base Resource Percent
export const baseResourcePercentStart = 0; //initialValue
export const baseResourcePercentUpgradeMax = 10; //maxNumbUpgrades
export const baseResourcePercentValueIncrement = 1.02; //valueIncrement
export const baseResourcePercentBaseCostLumens = 150; //baseCostLumens

//costIncreaseFunction
export const baseResourcePercentCostLumens = (currentUpgradeLevel:number, upgradeMax:number, baseCostLumens:number):number => {
    
    if (currentUpgradeLevel === 0) {
        
        return baseCostLumens;

    } else if (currentUpgradeLevel < upgradeMax) {

        return (1.8 * currentUpgradeLevel) * baseCostLumens;
    
    }

}

//instructions
export const baseResourcePercentInstructions = (upgradeLevel:number, increment:number):string => {
    let value = 0;

    if (upgradeLevel === 0 ) {
        value = 0;
    } else {
        value = upgradeLevel * increment
    }

    return `Current upgrade adds ${value} of created resources to all structures`;
}

//Base Gold Percent
export const baseGoldPercentStart = 0; //initialValue
export const baseGoldPercentUpgradeMax = 10; //maxNumbUpgrades
export const baseGoldPercentValueIncrement = 1.05; //valueIncrement
export const baseGoldPercentBaseCostLumens = 200; //baseCostLumens

//costIncreaseFunction
export const baseGoldPercentCostLumens = (currentUpgradeLevel:number, upgradeMax:number, baseCostLumens:number):number => {
    
    if (currentUpgradeLevel === 0) {
        
        return baseCostLumens;

    } else if (currentUpgradeLevel < upgradeMax) {

        return (2.2 * currentUpgradeLevel) * baseCostLumens;
    
    }

}

//instructions
export const baseGoldPercentInstructions = (upgradeLevel:number, increment:number):string => {
    let value = 0;

    if (upgradeLevel === 0 ) {
        value = 0;
    } else {
        value = upgradeLevel * increment
    }

    return `Current upgrade adds ${value} of gold created by structures`;
}


//Structure Faster Cycles
export const structureFasterCyclesStart = 0;
export const structureFasterCyclesUpgradeMax = 10;
export const structureFasterCyclesValueIncrement = 1.05;
export const structureFasterCyclesBaseCostLumens = 200;

export const structureFasterCyclesCostLumens = (currentUpgradeLevel:number, upgradeMax:number, baseCostLumens:number):number => {

    if (currentUpgradeLevel === 0) {
        
        return baseCostLumens;
    
    } else if (currentUpgradeLevel < upgradeMax) {

        return (2.2 * currentUpgradeLevel) * baseCostLumens;

    }

}

export const structureFasterCyclesInstructions = (upgradeLevel:number, increment:number):string => {
    let value = 0;

    if (upgradeLevel === 0) {
        value = 0;
    } else {
        value = upgradeLevel * increment;
    }

    return `Current speeds resource creation by ${value} for all buildings`;

}